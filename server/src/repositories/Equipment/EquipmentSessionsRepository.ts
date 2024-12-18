/**
 * EquipmentSessionsRepository.ts
 * DB Operations for Equipment Sessions
 */

import { knex } from "../../db/index.js";
import { EquipmentSessionRow } from "../../db/tables.js";

/**
 * Insert a new Equipment Session into table
 * @param equipmentID ID of equipment in use
 * @param userID ID of user who activated equipment
 * @param readerSlug name of ACS reader representing instance of equipment
 * @returns created Equipment Session
 */
export async function createEquipmentSession(equipmentID: number, userID: number, readerSlug?: string): Promise<EquipmentSessionRow> {
    return knex("EquipmentSessions").insert({equipmentID, userID, readerSlug});
}

/**
 * Fetch all equipment sessions where the length is not 0
 * @returns all finished Equipment Sessions
 */
export async function getEquipmentSessions(): Promise<EquipmentSessionRow[]> {
    return await knex("EquipmentSessions").select().where("sessionLength", "!=", 0);
}

/**
 * Update the last session made with the noted equipment and reader with a new session Length
 * @param equipmentID ID of equipment to filter by
 * @param sessionLength new session length in seconds
 * @param readerSlug readerSlug to filter by
 * @returns updated Equipment Session
 */
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