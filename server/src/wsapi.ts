import { Request } from "express";
import * as ws from "ws";
import { createLog } from "./repositories/AuditLogs/AuditLogRepository.js";
import { createReader, getReaderByID, getReaderByName, updateReaderStatus } from "./repositories/Readers/ReaderRepository.js";
import { EquipmentRow, ReaderRow } from "./db/tables.js";
import { getUserByCardTagID, getUsersFullName } from "./repositories/Users/UserRepository.js";
import { getEquipmentByID, getMissingTrainingModules, hasAccessByID } from "./repositories/Equipment/EquipmentRepository.js";
import { EntityNotFound } from "./EntityNotFound.js";
import { Privilege } from "./schemas/usersSchema.js";
import { createEquipmentSession, setLatestEquipmentSessionLength } from "./repositories/Equipment/EquipmentSessionsRepository.js";
import { hasSwipedToday } from "./repositories/Rooms/RoomRepository.js";
import { isApproved } from "./repositories/Equipment/AccessChecksRepository.js";


const API_NORMAL_LOGGING = process.env.API_NORMAL_LOGGING == "true";
const API_DEBUG_LOGGING = process.env.API_DEBUG_LOGGING == "true";

const MIN_SESSION_LENGTH = 15

var slugPool: Map<number, ConnectionData> = new Map();


/** 
 * adds a connection to the pool such that it can be communicated with
 * @param connData connection data associated with the shlug
 */
async function addConnection(connData: ConnectionData) {
    if (connData.readerId == null) {
        console.error("WSACS: Attempting to add invalid connection to active connections")
        return;
    } 
    if (connData.readerId in slugPool.keys()) {
        const reader = await getReaderByID(connData.readerId);
        console.error(`WSACS: Attempted to add duplicate id to slug pool (id: ${connData.readerId}, name: ${reader?.name ?? "unknown name"}). Possible shlug configuration issue?`);
        return;
    }
    slugPool.set(connData.readerId, connData);
}
/**
 * removes a shlug connection from the pool
 * @param connData connection data associated with the shlug we want to remove
 * @returns true if the item was removed. false if it wasn't found
 */
function removeConnection(connData: ConnectionData): boolean {
    if (connData.readerId == null || !slugPool.has(connData.readerId)) {
        console.error("WSACS: Attempting to remove invalid/nonexistent connection to shlug from pool")
        return false;
    }
    return slugPool.delete(connData.readerId);
}

export function sendState(readerId: number, state: string): string {
    let connData = slugPool.get(readerId);
    if (connData == null) {
        return "not found";
    }
    sendToShlugUnprompted(connData, { "State": state });
    return "success";
}


// Log helper
export async function wsApiDebugLog(
    message: string,
    category: string | undefined,
    ...entities: { id: any; label: string }[]
) {
    if (!API_DEBUG_LOGGING) {
        return;
    }
    createLog(message, category, ...entities);
}

// Log helper
export async function wsApiLog(
    message: string,
    category: string | undefined,
    ...entities: { id: any; label: string }[]
) {
    if (!API_NORMAL_LOGGING) {
        return;
    }
    createLog(message, category, ...entities);
}


interface ConnectionData {
    ws: ws.WebSocket
    currentState: string

    readerId?: number
    needsWelcome?: boolean

    alreadyComplainedAboutInvalidReader: boolean;
    toShlugSeqNum: number
    timeLastSent?: Date
}
function sendToShlugUnprompted(connData: ConnectionData, data: any) {

    const seqNum = connData.toShlugSeqNum;
    data["Seq"] = seqNum;
    connData.toShlugSeqNum++;
    const s: string = JSON.stringify(data);

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
    return { ws: ws, toShlugSeqNum: 0, currentState: "Idle", alreadyComplainedAboutInvalidReader: false };
}


async function authorizeUid(uid: string, readerId: number, needsWelcome: boolean, inResponse: ShlugResponse): Promise<ShlugResponse> {
    try {
        const reader = await getReaderByID(readerId);
        if (reader == null) {
            wsApiDebugLog(`Failed to retrieve information about reader ${readerId}. Can't authorize`, "auth");
            inResponse.Machine = 0;
            inResponse.Auth = uid;
            inResponse.Verified = 0;
            inResponse.Error = "Failed to retrieve info about reader";
            inResponse.Reason = "server-error";
            return inResponse
        }
        inResponse.Machine = reader.machineID;
        // Find User
        const user = await getUserByCardTagID(uid);
        // Find Machine
        var machine: EquipmentRow | undefined;
        try {
            machine = await getEquipmentByID(reader.machineID);
            if (machine == null) {
                // bizzare error handling bc api getters can be inconsistent
                throw EntityNotFound;
            }
        } catch (EntityNotFound) {
            machine = undefined;
        }

        if (user == null) {
            wsApiLog("UID {conceal} failed to activate {machine} - {equipment} with error '{error}'", "auth", { id: 0, label: uid ?? "undefined_uid" }, { id: reader.id, label: reader.name ?? "undefined" }, { id: machine?.id, label: machine.name ?? "unknown machine" }, { id: 406, label: "User does not exist" });

            inResponse.Error = "User does not exist";
            inResponse.Reason = "unknown-uid";
            return inResponse;
        }
        inResponse.Role = user.privilege; 
        inResponse.Auth = uid;

        // Find Machine
        if (machine == null) {
            wsApiLog("{user} failed to swipe into  a machine with error '{error}'", "auth", { id: user.id, label: getUsersFullName(user) }, { id: 406, label: `Machine ${reader.machineID} does not exist` });
            inResponse.Error = "Machine does not exist";
            inResponse.Reason = "unknown-machine";
            return inResponse;
        }

        //Staff bypass. Skip Welcome and training check.
        if (user.privilege == Privilege.STAFF) {
            wsApiLog("{user} has activated {access_device} - {equipment} with STAFF access", "auth", { id: user.id, label: getUsersFullName(user) }, { id: reader?.id, label: reader?.name }, { id: machine.id, label: machine.name });
            createEquipmentSession(machine.id, user.id, reader.machineID?.toString() ?? undefined);
            inResponse.Verified = 1;
            return inResponse;
        }

        //If needs welcome, check that room swipe has occured in the zone today
        if (needsWelcome && !(process.env.GLOBAL_WELCOME_BYPASS == "TRUE")) {
            const welcomed = await hasSwipedToday(machine.roomID, user.id);
            if (!welcomed) {
                wsApiDebugLog("{user} failed to swipe into {machine} -{equipment} with error '{error}'", "auth",
                    { id: user.id, label: getUsersFullName(user) },
                    { id: reader.id, label: reader?.name ?? "undefined" },
                    { id: machine.id, label: machine.name },
                    { id: 401, label: "User requires Welcome" });

                inResponse.Verified = 0;
                inResponse.Error = "User requires Welcome";
                inResponse.Reason = "no-welcome";
                return inResponse;
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

            inResponse.Verified = 0;
            inResponse.Error = "Incomplete trainings";
            inResponse.Reason = "missing-training";
            return inResponse;
        }

        //Check that equipment access check is completed
        if (!(process.env.GLOBAL_ACCESS_CHECK_BYPASS == "TRUE") && !(await isApproved(user.id, machine.id))) {
            wsApiDebugLog("{user} failed to swipe into {machine} - {equipment} with error '{error}'", "auth",
                { id: user.id, label: getUsersFullName(user) },
                { id: machine.id, label: reader.name },
                { id: machine.id, label: machine.name ?? "undefined" },
                { id: 401, label: "Missing Staff Approval" });
            inResponse.Verified = 0;
            inResponse.Error = "Missing Staff Approval";
            inResponse.Reason = "no-approval";
            return inResponse;
        }



        // Success
        wsApiLog("{user} has activated {machine} - {equipment}", "auth",
            { id: user.id, label: getUsersFullName(user) },
            { id: machine.id, label: reader.machineID?.toString() ?? "undefined" },
            { id: machine.id, label: machine.name });

        createEquipmentSession(machine.id, user.id, reader.machineID.toString());
        inResponse.Verified = 1;
        return inResponse;
    } catch (err) {
        wsApiDebugLog(`Unhandled error when authorizing on {access_device} - ${err}`, "auth", { id: readerId, label: (await getReaderByID(readerId))?.name ?? "unknown device" })
        inResponse.Role = "unknown role";
        inResponse.Verified = 0;
        inResponse.Error = "Unknown Error";
        inResponse.Reason = "server-error";
        return inResponse;
    }
}

/**
 * Finds and packages data requested by the shlug from the server
 * @param connData state of the connection
 * @param requested_values list of keys that the shlug is requesting from us
 * @returns response containing those keys
 */
function handleRequest(connData: ConnectionData | undefined, requested_values: string[]): ShlugResponse {
    var obj: ShlugResponse = { Seq: -1 };
    for (let value of requested_values) {
        switch (value) {
            case "Time":
                obj.Time = Math.floor(Date.now() / 1000);
                break;
            case "State":
                obj.State = "Idle";
                break;
            default:
                wsApiDebugLog(`Invalid request from Shlug ${connData?.readerId}`, "ACS Message")
        }
    }
    return obj;
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
    Message?: string;  // Log Message to echo to history

    State?: string; // Current State
    UID?: string; // Reason for switching to that state

    Auth?: string; // UID to authorize

    Seq: number;
    Key?: string;
}
// What the server sends to the shlug in response to a ShlugMessage
interface ShlugResponse {
    Seq: number
    Machine?: number
    Auth?: string
    Verified?: number
    Role?: string
    Error?: string
    Reason?: string

    Time?: number /// unix timestamp
    State?: string
}

/**
 * Validates that a websocket message is actually JSON from a shlug
 * @param ev The data that came over the websocket. Valid if textual json
 * @param req Information about the initial request (ip, flags, etc)
 * @returns a valid ShlugMessage on successful parsing. null on error
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

/**
 * Parses and handles the initial informational message sent by the shlug identifying itself
 * @param connData state of the connection
 * @param message the message that the shlug sent
 * @returns true on successful parse. False if missing fields or otherwise invalid
 */
async function handleBootupMessage(connData: ConnectionData, message: ShlugMessage): Promise<boolean> {
    const required = [message.Zone, message.NeedsWelcome, message.MachineType, message.MachineName, message.Key, message.FWVersion, message.HWVersion, message.HWType,];
    if (required.some((x) => x == null)) {
        wsApiDebugLog(`WSACS: Missing fields in boot message. Got ${JSON.stringify(message)}`, "status");
        return false;
    }

    var reader: ReaderRow | undefined = await getReaderByName(message.MachineName ? message.MachineName : "");
    connData.readerId = reader?.id;
    connData.needsWelcome = message.NeedsWelcome;

    if (reader == null) {
        if (await getEquipmentByID(message.MachineType ?? 0)) {

        }
        reader = await createReader({
            name: message.MachineName,
            machineID: message.MachineType,
            machineType: String(message.MachineType),
            zone: String(message.Zone), // TODO: Make this a number when zone/room debacle is figured out
        });


        if (reader == undefined) {
            wsApiDebugLog("Failed to create new access device. Error '{error}'", "status", { id: 400, label: "Reader does not exist" });
            return false;
        }
        else {
            wsApiLog("New Access Device {access_device} registered", "status", { id: reader?.id, label: reader?.name })
        }
    }
    wsApiLog(`WSACS: Opened connection to {access_device}`, "status", { id: reader?.id ?? 0, label: reader?.name ?? "unknown name" })


    // update with new info
    await updateReaderStatus({
        id: reader.id,
        machineID: parseInt(reader.machineType),
        machineType: reader.machineType,
        zone: reader.zone,
        temp: reader.temp,
        state: message.State ?? "unknown-state",
        currentUID: "",
        recentSessionLength: reader.recentSessionLength,
        lastStatusReason: reader.lastStatusReason,
        scheduledStatusFreq: reader.scheduledStatusFreq,
        helpRequested: reader.helpRequested,
        BEVer: message.FWVersion ?? undefined,
        FEVer: message.FWVersion ?? undefined,
        HWVer: message.HWVersion ?? undefined,
    });

    return true;
}

/**
 * handles a state change as told by the shlug
 * @param reader information about the reader that is changing
 * @param newState the state the shlug changed to
 * @param activeUID the active UID if there is one. null if no card inserted
 */
async function handleStateTransition(reader: ReaderRow, newState: string, activeUID: string | undefined) {
    const timeOfChange: Date = new Date();
    const oldState = reader.state;
    const oldUID = reader.currentUID;

    reader.state = newState;
    reader.currentUID = activeUID ?? "";
    reader.lastStatusTime = timeOfChange;
    reader.lastStatusReason = "websocket-poll";

    if (reader.recentSessionLength == null) {
        reader.recentSessionLength = 0;
    }

    const user = await getUserByCardTagID(oldUID ?? "");


    if (oldState != newState) {
        if (user == null) {
            wsApiLog(`State of {access_device} changed: ${oldState} -> ${newState}`, "state", { id: reader?.id, label: reader?.name });
        } else {
            wsApiLog(`{user} changed state of {access_device}: ${oldState} -> ${newState}`, "state", { id: user.id ?? 0, label: user ? getUsersFullName(user) : "NULL" }, { id: reader?.id, label: reader?.name });
        }
        if (newState == "Unlocked") {
            reader.sessionStartTime = new Date();
            reader.recentSessionLength = 0;
        }

        if (oldState == "Unlocked" && reader.recentSessionLength > MIN_SESSION_LENGTH) {
            // end last session normally
            reader.currentUID = activeUID ?? '';
            const equipment = await getEquipmentByID(parseInt(reader.machineType));
            // Update equipment session that was created when we authed
            await setLatestEquipmentSessionLength(parseInt(reader.machineType), reader.recentSessionLength, reader.name);
            if (user != null) {
                const timeString = new Date(reader.recentSessionLength * 1000).toISOString().slice(11, 19);
                await createLog(`{user} signed out of {machine} - {equipment} (Session: ${timeString})`, "status", { id: user.id, label: getUsersFullName(user) }, { id: reader.id, label: reader.name ?? "undefined" }, { id: equipment.id, label: equipment.name });
            }
        }
    }
    if (newState == "Unlocked") {
        const now = new Date();
        const then = reader.sessionStartTime ?? new Date(); // if not there, set ot 0
        const elapsedSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
        reader.recentSessionLength = elapsedSeconds;
    }



    await updateReaderStatus(reader);

}

function isReplyWorthSending(resp: ShlugResponse): boolean {
    if (resp.Verified || resp.Auth || resp.Error || resp.Reason || resp.Machine || resp.Role || resp.State || resp.Time) {
        return true
    }
    return false
}

/**
 * Handler for the ACS Websocket API
 * @param ws handle for websocket
 * @param req data from the original request to the endpoint (one per shlug)
 */
export async function ws_acs_api(ws: ws.WebSocket, req: Request) {
    var connData: ConnectionData = initConnectionData(ws);
    console.log(`WSACS: Websocket opened to ${req.ip}`)
    try {
    ws.onclose = async function (ev: ws.CloseEvent) {
        try {
        if (connData.readerId == null) {
            // Connection was never associated with a real reader (boot message never sent, probably something fishy)
            console.error(`WSACS: Websocket from non-reader ${req.ip} closed`);
            return;
        }
            let reader: ReaderRow | undefined = await getReaderByID(connData.readerId);
        wsApiLog(`Websocket to {access_device} closed. code:${ev.code}. ${ev.reason.length > 0 ? "Reason: " + ev.reason : ""}`, "status", { id: connData.readerId ?? 0, label: reader?.name ?? "unknown shlug" });
            removeConnection(connData);
        } catch (e) {
            console.error(`WSACS: Close Exception: ${e}`)
        }

    };

    ws.onerror = function (ev: ws.ErrorEvent) {
        console.error(`WSACS: websocket error ${ev.error} - ${ev.type}: ${ev.message}`)
        ws.close(4000, "got unrecoverable error");
    }

    ws.onmessage = async function (ev: ws.MessageEvent) {
        try {
            const shlugMessage: ShlugMessage | undefined = validateShlugMessage(ev, req);
            if (shlugMessage == null) {
            return;
        }

            // First Message is special, identifies the shlug to the server
            if (shlugMessage.Seq === 0) {
            // Bootup message
                if (shlugMessage.Key != process.env.API_KEY) {
                    wsApiLog(`WSACS: Invalid key from ${req.ip} on connect.`, "status");
                ws.close(4000, "Invalid Key. Rejected")
                return;
            }
                if (!await handleBootupMessage(connData, shlugMessage)) {
                    // failed to setup
                    return;
                }
                // Successfully read bootup message. Add this to available connections
                addConnection(connData);
        }

            // Get reader that was setup by handleBootupMessage
            var reader = await getReaderByID(connData.readerId ?? 0);
            if (reader == null) {
                if (!connData.alreadyComplainedAboutInvalidReader) {
                    wsApiDebugLog(`Failed to find entry for device ${connData.readerId}. Error '{error}'`, "status", { id: 400, label: "Reader does not exist" });
                    connData.alreadyComplainedAboutInvalidReader = true;
                }
                return;
            }
            var response: ShlugResponse = handleRequest(connData, shlugMessage.Request || [])


            if (shlugMessage.Message) {
                wsApiLog(`{access_device} message: ${shlugMessage.Message}`, "message", { id: reader.id, label: reader.name })
            }
            if (shlugMessage.State) {
                await handleStateTransition(reader, shlugMessage.State, shlugMessage.UID)
            }

            if (shlugMessage.Auth) {
                response = await authorizeUid(shlugMessage?.Auth, connData.readerId ?? 0, connData.needsWelcome ?? false, response)
            }
            if (isReplyWorthSending(response)) {
                replyToShlug(connData, response, shlugMessage.Seq);
            }
        } catch (e) {
            console.error(`WSACS: Message Exception: ${e}`)
        }

    }

    } catch (e) {
        console.error(`WSACS: Exception: ${e}`)
    }
}
