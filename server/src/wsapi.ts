import { Request } from "express";
import * as ws from "ws";
import { createLog } from "./repositories/AuditLogs/AuditLogRepository.js";
import { getReaderByID, getReaderByName } from "./repositories/Readers/ReaderRepository.js";
import { EquipmentRow, EquipmentSessionRow, ReaderRow } from "./db/tables.js";


const API_NORMAL_LOGGING = process.env.API_NORMAL_LOGGING == "true";
const API_DEBUG_LOGGING = process.env.API_DEBUG_LOGGING == "true";

// var activeConnections: Map<string, ConnectionData> = new Map();
// function addConnection(connData: ConnectionData) {
// if (connData.machineName in ActiveConnections.keys()) { }
// }


// function sendState(){}






export async function wsApiDebugLog(
    message: string,
    category: string | undefined,
    ...entities: { id: any; label: string }[]
) {
    console.log(category, message, entities)
    if (!API_DEBUG_LOGGING) {
        return;
    }
    createLog(message, category, ...entities);
}

export async function wsApiLog(
    message: string,
    category: string | undefined,
    ...entities: { id: any; label: string }[]
) {
    console.log(category, message, entities)
    if (!API_NORMAL_LOGGING) {
        return;
    }
    createLog(message, category, ...entities);
}


interface ConnectionData {
    ws: ws.WebSocket

    readerId?: number

    toShlugSeqNum: number
    timeLastSent?: Date
}
function initConnectionData(ws: ws.WebSocket): ConnectionData {
    return { ws: ws, toShlugSeqNum: 0 };
}



function verifyConnectionData(connData: ConnectionData | undefined): boolean {
    if (connData === undefined) {
        wsApiDebugLog("No Machine Data associated with websocket connection", "ACS Message");
        return false;
    }
    return true;
}

function handleRequest(connData: ConnectionData | undefined, requested_values: string[]): ShlugResponse | undefined {
    if (!verifyConnectionData(connData)) {
        return;
    }
    var obj: ShlugResponse = { Seq: -1 };
    for (let value of requested_values) {
        switch (value) {
            case "Time":
                console.log("Request for Time from shlug");
                obj.Time = Date.now() / 1000;
                break;
            case "State":
                console.log("Request for State from shlug");
                // TODO check if theres any reason why you shouldnt be 
                obj.State = "Idle";
                break;
            default:
                wsApiDebugLog(`Invalid request from Shlug ${connData?.machineType}`, "ACS Message")
        }
    }
    return Object.keys(obj).length > 1 ? obj : undefined;
}

// What the shlug sends over websockets
interface ShlugMessage {
    Zone?: number;
    NeedsWelcome?: boolean;
    MachineType?: number;
    MachineName?: string;
    Key?: string;
    FWVersion?: string;
    HWVersion?: string;
    HWType?: string;
    Request?: string[];
    Seq: number;
}
interface ShlugResponse {
    Seq: number
    Time?: number /// unix timestamp
    State?: string
}

/**
 * 
 * @param ev The data that came over the websocket. Valid if textual json
 * @param req Information about the initial request (ip, flags, etc)
 * @returns a valid ShlugMessage on successful parsing and correct key. null on error
 */
function validateShlugMessage(ev: ws.MessageEvent, req: Request): ShlugMessage | undefined {
    if (typeof ev.data != 'string') {
        // malformed data
        console.error(`WSACS: Non-string data received from ${req.ip}`);
        return undefined;
    }
    var jdata: ShlugMessage;
    try {
        jdata = JSON.parse(ev.data as string) as ShlugMessage;
    } catch (err: any) {
        console.error(`WSACS: Text data from ${req.ip} was not valid JSON: ${err}. Text was: ${ev.data as string}`);
        return undefined;
    }
    if (jdata.Seq == null) {
        wsApiLog(`WSACS: Received valid JSON  from ${req.ip} with no Sequence Number. Got ${JSON.stringify(jdata)}`, "status")
        return undefined;
    }
    if (jdata.Key != process.env.API_KEY) {
        wsApiLog(`WSACS: Invalid key from ${req.ip}. Got ${jdata.Key}`, "status");
    }
    return jdata;
}

async function handleBootupMessage(connData: ConnectionData, sdata: ShlugMessage): Promise<boolean> {
    const required = [sdata.Zone, sdata.NeedsWelcome, sdata.MachineType, sdata.MachineName, sdata.Key, sdata.FWVersion, sdata.HWVersion, sdata.HWType, sdata.Request];
    if (required.some((x) => x == null)) {
        wsApiDebugLog(`WSACS: Missing fields in boot message. Got ${JSON.stringify(sdata)}`, "status");
        return false;
    }

    console.log("Boot Message", sdata);

    var reader: ReaderRow | undefined = await getReaderByName(sdata.MachineName ? sdata.MachineName : "");

    if (reader) {
        console.log("Reader: ", reader);
        connData.readerId = reader.id;
    } else {
        console.log("Reader doesn't exist");
    }

    wsApiLog(`WSACS: Opened connection to {access_device}`, "status", { id: reader?.id ?? 0, label: reader?.name ?? "unknown name" })
    return true;
}

export async function ws_acs_api(ws: ws.WebSocket, req: Request) {
    var connData: ConnectionData = initConnectionData(ws);
    console.log(`WSACS: Websocket opened to ${req.ip}`)
    ws.onclose = async function (ev: ws.CloseEvent) {
        if (connData.readerId == null) {
            // Connection was never associated with a real reader (boot message never sent, probably something fishy)
            console.error(`Websocket from non-reader ${req.ip} closed`);
            return;
        }
        var reader: ReaderRow | undefined = await getReaderByID(connData.readerId ?? 0);

        wsApiLog(`Websocket to {access_device} closed. code:${ev.code}. ${ev.reason.length > 0 ? "Reason: " + ev.reason : ""}`, "status", { id: connData.readerId ?? 0, label: reader?.name ?? "unknown shlug" });
    };
    ws.onerror = function (ev: ws.ErrorEvent) {
        console.error(`WSACS: websocket error ${ev.error} - ${ev.type}: ${ev.message}`)
    }
    ws.onmessage = async function (ev: ws.MessageEvent) {
        const jdata: ShlugMessage | undefined = validateShlugMessage(ev, req);
        if (jdata == null) {
            return;
        }

        if (jdata.Seq === 0) {
            // Bootup message
            handleBootupMessage(connData, jdata);
        }
        const reply: ShlugResponse | undefined = handleRequest(connData, jdata.Request || [])
        if (reply) {
            reply.Seq = jdata.Seq;
            ws.send(JSON.stringify(reply));
        }

        console.log(`Got ${JSON.stringify(jdata)}`);
    }

}
