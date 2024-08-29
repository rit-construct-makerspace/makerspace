import { knex } from "../../db/index.js";
import { ZoneRow } from "../../db/tables.js";

export async function getZones(): Promise<ZoneRow[]> {
    return await knex("Zones").select();
}

export async function getZoneByID(id: number): Promise<ZoneRow | undefined> {
    return await knex("Zones").select().where({id}).first();
}

export async function createZone(name: string): Promise<ZoneRow> {
    return (await knex("Zones").insert({name}).returning("*"))[0];
}

export async function deleteZone(id: number): Promise<number> {
    await knex("OpenHours").update({zoneID: null}).where({zoneID: id})
    await knex("Rooms").update({zoneID: null}).where({zoneID: id})

    return await knex("Zones").delete().where({id});
}