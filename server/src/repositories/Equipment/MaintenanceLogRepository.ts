import { knex } from "../../db/index.js";
import { MaintenanceLogRow, MaintenanceTagRow, ResolutionLogRow } from "../../db/tables.js";

export async function createMaintenanceLog(authorID: number, equipmentID: number, instanceID: number, content: string): Promise<MaintenanceLogRow> {
    return await knex("MaintenanceLogs").insert({authorID, equipmentID, instanceID, content});
}

export async function deleteMaintenanceLog(id: number): Promise<boolean> {
    await knex("MaintenanceLogs").delete().where({id});
    return true;
}

export async function updateMaintenanceLog(id: number, content: string, tagID1: number, tagID2: number, tagID3: number): Promise<MaintenanceLogRow | undefined> {
    return (await knex("MaintenanceLogs").update({content, tagID1, tagID2, tagID3}).where({id}).returning("*"))[0];
}

export async function getMaintenanceLogsByEquipment(equipmentID: number): Promise<MaintenanceLogRow[]> {
    return await knex("MaintenanceLogs").select().where({equipmentID});
}

export async function getMaintenanceLogByID(id: number): Promise<MaintenanceLogRow | undefined> {
    return await knex("MaintenanceLogs").select().where({id}).first();
}

export async function createResolutionLog(authorID: number, equipmentID: number, instanceID: number, content: string): Promise<ResolutionLogRow> {
    return await knex("ResolutionLogs").insert({authorID, equipmentID, instanceID, content});
}

export async function deleteResolutionLog(id: number): Promise<boolean> {
    await knex("ResolutionLogs").delete().where({id});
    return true;
}

export async function getResolutionLogsByEquipment(equipmentID: number): Promise<ResolutionLogRow[]> {
    return await knex("ResolutionLogs").select().where({equipmentID});
}

export async function getResolutionLogByID(id: number): Promise<ResolutionLogRow | undefined> {
    return await knex("ResolutionLogs").select().where({id}).first();
}

export async function updateResolutionLog(id: number, content: string, tagID1: number, tagID2: number, tagID3: number): Promise<ResolutionLogRow | undefined> {
    return (await knex("ResolutionLogs").update({content, tagID1, tagID2, tagID3}).where({id}).returning("*"))[0];
}


export async function createMaintenanceTag(equipmentID: number | null, label: string, color: string,): Promise<MaintenanceTagRow> {
    return await knex("MaintenanceTags").insert({equipmentID: equipmentID ?? undefined, label, color});
}

export async function updateMaintenanceTag(id: number, label: string, color: string): Promise<MaintenanceTagRow | undefined> {
    await knex("MaintenanceTags").update({label, color}).where({id});
    return await getMaintenanceTagByID(id);
}

export async function deleteMaintenanceTag(id: number): Promise<boolean> {
    await knex("MaintenanceTags").delete().where({id});
    return true;
}

export async function getMaintenanceTags(): Promise<MaintenanceTagRow[]> {
    return await knex("MaintenanceTags").select();
}

export async function getMaintenanceTagsByEquipmentOrGlobal(equipmentID: number): Promise<MaintenanceTagRow[]> {
    return await knex("MaintenanceTags").select().where({equipmentID}).orWhereNull("equipmentID");
}

export async function getMaintenanceTagByID(id: number): Promise<MaintenanceTagRow | undefined> {
    return await knex("MaintenanceTags").select().where({id}).first();
}