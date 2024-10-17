import { knex } from "../../db/index.js";
import { MaintenanceLogRow } from "../../db/tables.js";

export async function createMaintenanceLog(authorID: number, content: string): Promise<MaintenanceLogRow> {
    return await knex("MaintenanceLogs").insert({authorID, content});
}

export async function deleteMaintenanceLog(id: number): Promise<boolean> {
    await knex("MaintenanceLogs").delete().where({id});
    return true;
}

export async function getMaintenanceLogsByEquipment(equipmentID: number): Promise<MaintenanceLogRow[]> {
    return await knex("MaintenanceLogs").select().where({equipmentID});
}