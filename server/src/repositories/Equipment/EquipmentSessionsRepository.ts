import { knex } from "../../db/index.js";
import { EquipmentSessionRow } from "../../db/tables.js";

export async function createEquipmentSession(equipmentID: number, userID: number): Promise<EquipmentSessionRow> {
    return knex("EquipmentSessions").insert({equipmentID, userID});
}

export async function getEquipmentSessions(): Promise<EquipmentSessionRow[]> {
    return await knex("EquipmentSessions").select().where("sessionLength", "!=", 0);
}

export async function setLatestEquipmentSessionLength(equipmentID: number, sessionLength: number, readerSlug: string) {
    const latest = await knex("EquipmentSessions").select()
        .where({equipmentID})
        .orderBy("start", "desc")
        .first();
    if (latest == undefined) return undefined;
    return await knex("EquipmentSessions")
        .update({sessionLength, readerSlug})
        .where({id: latest.id});
}