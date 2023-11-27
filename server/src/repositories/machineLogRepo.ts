import { knex } from "../db";
import {MachineLogInput} from "../schemas/machineLogSchema";

export async function getMachineLogsByMachine(machineID: number) {
    return knex('MachineLogs')
        .select()
        .where("machineID", machineID)
        .orderBy('startTime', 'asc');
}

export async function getMachineLogsByUser(userID: number) {
    return knex('MachineLogs')
        .select()
        .where("userID", userID);
}

export async function createMachineLog(logInput: MachineLogInput): Promise<number> {
    const [logID] = await knex('MachineLogs').insert(
        {
            dateTime: logInput.dateTime,
            machineID: logInput.machineID,
            userID: logInput.userID,
        },
        "id"
    );
    if (logID == null) {
        throw new Error("Error creating machine log");
    }

    return logID;
}