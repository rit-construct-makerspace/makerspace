import { knex } from "../../db/index.js";
import { EquipmentSessionRow } from "../../db/tables.js";

export async function createEquipmentSession(equipmentID: number, userID: number, readerSlug?: string): Promise<EquipmentSessionRow> {
    return knex("EquipmentSessions").insert({equipmentID, userID, readerSlug});
}

export async function getEquipmentSessions(): Promise<EquipmentSessionRow[]> {
    return await knex("EquipmentSessions").select().where("sessionLength", "!=", 0);
}

export async function setLatestEquipmentSessionLength(equipmentID: number, sessionLength: number, readerSlug: string) {
    const latest = await knex("EquipmentSessions").select()
        .where({equipmentID, readerSlug})
        .orderBy("start", "desc")
        .first();
    if (latest == undefined) return undefined;
    return await knex("EquipmentSessions")
        .update({sessionLength})
        .where({id: latest.id});
}