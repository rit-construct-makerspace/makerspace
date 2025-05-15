import { Request } from "express";
import * as ws from "ws";
import { createLog } from "./repositories/AuditLogs/AuditLogRepository.js";
import { createReader, getReaderByID, getReaderByName, updateReaderStatus } from "./repositories/Readers/ReaderRepository.js";
import { EquipmentRow, EquipmentSessionRow, ReaderRow } from "./db/tables.js";
import { getUserByCardTagID, getUsersFullName } from "./repositories/Users/UserRepository.js";
import { getEquipmentByID, getMissingTrainingModules, hasAccessByID } from "./repositories/Equipment/EquipmentRepository.js";
import { EntityNotFound } from "./EntityNotFound.js";
import { Privilege } from "./schemas/usersSchema.js";
import { createEquipmentSession } from "./repositories/Equipment/EquipmentSessionsRepository.js";
import { hasSwipedToday } from "./repositories/Rooms/RoomRepository.js";
import { UUIDMock } from "graphql-scalars";
import { isApproved } from "./repositories/Equipment/AccessChecksRepository.js";


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
    needsWelcome?: boolean

    toShlugSeqNum: number
    timeLastSent?: Date
}
function sendToShlugUnprompted(connData: ConnectionData, data: any) {

    const seqNum = connData.toShlugSeqNum;
    data["Seq"] = seqNum;
    connData.toShlugSeqNum++;
    const s: string = JSON.stringify(data);

    console.log("Sending", s);
    connData.timeLastSent = new Date();
    connData.ws.send(s);
}

function replyToShlug(connData: ConnectionData, data: any, replyTo: number) {
    connData.timeLastSent = new Date();
    var toSend = data as ShlugResponse;
    toSend.Seq = replyTo;

    connData.ws.send(JSON.stringify(toSend));
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

interface Authorize {
    Machine: number
    Auth: string
    Allowed: number
    Role?: string
}
interface AuthorizeNo extends Authorize {
    Error: string
    Reason: string
}

async function authorizeUid(uid: string, readerId: number, needsWelcome: boolean): Promise<Authorize | AuthorizeNo> {
    try {
        const reader = await getReaderByID(readerId);
        if (reader == null) {
            wsApiDebugLog(`Failed to retrieve information about reader ${readerId}. Can't authorize`, "auth");
            return { Machine: 0, Auth: uid, Allowed: 0 };
        }
        // Find User
        const user = await getUserByCardTagID(uid);
        if (user == null) {
            wsApiLog("UID {conceal} failed to activate a machine with error '{error}'", "auth", { id: 0, label: uid ?? "undefined_uid" }, { id: 406, label: "User does not exist" });
            return {
                Machine: readerId,
                Auth: uid,
                Allowed: 0,
                Error: "User does not exist",
                Reason: "unknown-uid",
            }
        }
        // Find Machine
        var machine: EquipmentRow
        try {
            machine = await getEquipmentByID(reader.machineID);
            if (machine == null) {
                // bizzare error handling bc api getters can be inconsistent
                throw EntityNotFound;
            }
        } catch (EntityNotFound) {
            wsApiLog("{user} failed to swipe into  a machine with error '{error}'", "auth", { id: user.id, label: getUsersFullName(user) }, { id: 406, label: `Machine ${reader.machineID} does not exist` });
            return {
                Machine: reader.machineID,
                Auth: uid,
                Role: user.privilege,
                Allowed: 0,
                Error: "Machine does not exist",
                Reason: "unknown-machine",
            }
        }

        //Staff bypass. Skip Welcome and training check.
        if (user.privilege == Privilege.STAFF) {
            wsApiLog("{user} has activated {machine} - {equipment} with STAFF access", "auth", { id: user.id, label: getUsersFullName(user) }, { id: machine.id, label: reader.machineID.toString() ?? "undefined" }, { id: machine.id, label: machine.name });
            createEquipmentSession(machine.id, user.id, reader.machineID?.toString() ?? undefined);
            return {
                Machine: reader.machineID,
                Auth: uid,
                Allowed: 1,
                Role: user.privilege,
            }
        }

        //If needs welcome, check that room swipe has occured in the zone today
        if (needsWelcome && !(process.env.GLOBAL_WELCOME_BYPASS == "TRUE")) {
            const welcomed = await hasSwipedToday(machine.roomID, user.id);
            console.log("Welcomed: ", welcomed)
            if (!welcomed) {
                wsApiDebugLog("{user} failed to swipe into {machine} -{equipment} with error '{error}'", "auth",
                    { id: user.id, label: getUsersFullName(user) },
                    { id: reader.id, label: reader?.name ?? "undefined" },
                    { id: machine.id, label: machine.name },
                    { id: 401, label: "User requires Welcome" });

                return {
                    Machine: reader.machineID,
                    Auth: uid,
                    Role: user.privilege,
                    Allowed: 0,
                    Error: "User requires Welcome",
                    Reason: "no-welcome",
                }
            }
        }

        //Check that all required trainings are passed
        if (!(process.env.GLOBAL_TRAINING_BYPASS == "TRUE") && !(await hasAccessByID(user.id, machine.id))) {
            const incompleteTrainings = await getMissingTrainingModules(user, machine.id);
            var incompleteTrainingsStr = ""
            incompleteTrainings.forEach((module, i) => {
                incompleteTrainingsStr += module.name;
                if (i < incompleteTrainings.length - 1) incompleteTrainingsStr += ", ";
            });
            wsApiDebugLog(`{user} failed to swipe into {machine} - {equipment} with error '{error}' [${incompleteTrainingsStr}]`, "auth",
                { id: user.id, label: getUsersFullName(user) },
                { id: machine.id, label: reader.name ?? "undefined" },
                { id: machine.id, label: machine.name },
                { id: 401, label: "Incomplete trainings" });

            return {
                Machine: reader.machineID,
                Auth: uid,
                Role: user.privilege,
                Allowed: 0,
                Error: "Incomplete trainings",
                Reason: "missing-training",
            }
        }

        //Check that equipment access check is completed
        if (!(process.env.GLOBAL_ACCESS_CHECK_BYPASS == "TRUE") && !(await isApproved(user.id, machine.id))) {
            wsApiDebugLog("{user} failed to swipe into {machine} - {equipment} with error '{error}'", "auth",
                { id: user.id, label: getUsersFullName(user) },
                { id: machine.id, label: reader.name },
                { id: machine.id, label: machine.name ?? "undefined" },
                { id: 401, label: "Missing Staff Approval" });
            return {
                Machine: reader.machineID,
                Auth: uid,
                Role: user.privilege,
                Allowed: 0,
                Error: "Missing Staff Approval",
                Reason: "no-approval",
            }
        }



        // Success
        wsApiLog("{user} has activated {machine} - {equipment}", "auth",
            { id: user.id, label: getUsersFullName(user) },
            { id: machine.id, label: reader.machineID?.toString() ?? "undefined" },
            { id: machine.id, label: machine.name });

        createEquipmentSession(machine.id, user.id, reader.machineID.toString());
        return {
            Machine: reader.machineID,
            Auth: uid,
            Role: user.privilege,
            Allowed: 1,
        }

    } catch (err) {
        wsApiDebugLog(`Unhandled error when authorizing on {access_device} - ${err}`, "auth", { id: readerId, label: (await getReaderByID(readerId))?.name ?? "unknown device" })
        return {
            Machine: 0,
            Auth: uid,
            Role: "unknown role",
            Allowed: 0,
            Error: "Unknown Error",
            Reason: "server-error"
        }
    }
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
                obj.Time = Math.floor(Date.now() / 1000);
                break;
            case "State":
                console.log("Request for State from shlug");
                // TODO check if theres any reason why you shouldnt be 
                obj.State = "Idle";
                break;
            default:
                wsApiDebugLog(`Invalid request from Shlug ${connData?.readerId}`, "ACS Message")
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
    FWVersion?: string;
    HWVersion?: string;
    HWType?: string;
    Request?: string[];
    Message?: string;
    Auth?: string;
    Seq: number;
    Key?: string;
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
    wsApiLog(`WSACS: Opened connection to {access_device}`, "status", { id: reader?.id ?? 0, label: reader?.name ?? "unknown name" })
    connData.readerId = reader?.id;
    connData.needsWelcome = sdata.NeedsWelcome;

    if (reader == null) {
        reader = await createReader({
            name: sdata.MachineName,
            machineID: sdata.MachineType,
            machineType: String(sdata.MachineType),
            zone: String(sdata.Zone) // TODO: Make this a number when zone/room debacle is figured out
        });
        if (reader == undefined) {
            wsApiDebugLog("Failed to create new access device. Error '{error}'", "status", { id: 400, label: "Reader does not exist" });
            return false;
        }
        else {
            wsApiLog("New Access Device {access_device} registered", "status", { id: reader?.id, label: reader?.name })
        }
    }

    // update with new info
    const newReader = await updateReaderStatus({
        id: reader.id,
        machineID: parseInt(reader.machineType),
        machineType: reader.machineType,
        zone: reader.zone,
        temp: reader.temp,
        state: reader.state,
        currentUID: reader.currentUID,
        recentSessionLength: reader.recentSessionLength,
        lastStatusReason: reader.lastStatusReason,
        scheduledStatusFreq: reader.scheduledStatusFreq,
        helpRequested: reader.helpRequested,
        BEVer: sdata.FWVersion ?? undefined,
        FEVer: sdata.FWVersion ?? undefined,
        HWVer: sdata.HWVersion ?? undefined,
    });


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
            if (jdata.Key != process.env.API_KEY) {
                wsApiLog(`WSACS: Invalid key from ${req.ip} on connect. Got ${jdata.Key}`, "status");
                ws.close(4000, "Invalid Key. Rejected")
                return;
            }
            handleBootupMessage(connData, jdata);
        }

        const reply: ShlugResponse | undefined = handleRequest(connData, jdata.Request || [])
        // Auth, Message, and response/reply mutually exclusive
        if (jdata.Message) {
            const reader = await getReaderByID(connData.readerId ?? 0);
            if (reader == null) {
                wsApiLog(`message from unknown reader: ${jdata.Message}`, "message")
            } else {
                wsApiLog(`{access_device} message: ${jdata.Message}`, "message", { id: reader.id, label: reader.name })
            }
        } else if (jdata.Auth) {
            const resp: Authorize = await authorizeUid(jdata?.Auth, connData.readerId ?? 0, connData.needsWelcome ?? false)
            replyToShlug(connData, resp, jdata.Seq);
        } else if (reply) {
            replyToShlug(connData, reply, jdata.Seq);
        }

        console.log(`Got ${JSON.stringify(jdata)}`);
    }

}
