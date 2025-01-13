/**
 * ZoneRepository.ts
 * DB Operations for ZOnes
 */

import { knex } from "../../db/index.js";
import { ZoneRow } from "../../db/tables.js";


/**
 * Fetch all Zones
 * @returns all Zones
 */
export async function getZones(): Promise<ZoneRow[]> {
    return await knex("Zones").select();
}

/**
 * Fetch Zone by ID
 * @param id ID of Zone
 * @returns Zone or undefined if ID not exist
 */
export async function getZoneByID(id: number): Promise<ZoneRow | undefined> {
    return await knex("Zones").select().where({id}).first();
}

/**
 * Insert a new Zone into the table
 * @param name new zone name
 * @returns new Zone
 */
export async function createZone(name: string): Promise<ZoneRow> {
    return (await knex("Zones").insert({name}).returning("*"))[0];
}

/**
 * Delete a Zone. Remove references to Zone from Rooms and ZoneHours
 * @param id ID of Zone to delete
 * @returns 1
 */
export async function deleteZone(id: number): Promise<number> {
    await knex("OpenHours").update({zoneID: null}).where({zoneID: id})
    await knex("Rooms").update({zoneID: null}).where({zoneID: id})

    return await knex("Zones").delete().where({id});
}