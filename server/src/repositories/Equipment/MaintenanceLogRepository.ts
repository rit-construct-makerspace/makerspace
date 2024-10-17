import { knex } from "../../db/index.js";
import { MaintenanceLogRow } from "../../db/tables.js";

export async function createMaintenanceLog(authorID: number, equipmentID: number, content: string): Promise<MaintenanceLogRow> {
    return await knex("MaintenanceLogs").insert({authorID, equipmentID, content});
}

export async function deleteMaintenanceLog(id: number): Promise<boolean> {
    await knex("MaintenanceLogs").delete().where({id});
    return true;
}

export async function getMaintenanceLogsByEquipment(equipmentID: number): Promise<MaintenanceLogRow[]> {
    return await knex("MaintenanceLogs").select().where({equipmentID});
}

export async function getMaintenanceLogByID(id: number): Promise<MaintenanceLogRow | undefined> {
    return await knex("MaintenanceLogs").select().where({id}).first();
}