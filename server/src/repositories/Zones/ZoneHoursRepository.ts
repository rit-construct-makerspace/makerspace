/**
 * ZoneHoursRepository.ts
 * DB Operations for Zone Hours / Open Hours
 */

import { knex } from "../../db/index.js";
import { ZoneHoursRow } from "../../db/tables.js";

export enum WeekDays {
    SUNDAY = 1,
    MONDAY = 2,
    TUESDAY = 3,
    WEDNESDAY = 4,
    THURSDAY = 5,
    FRIDAY = 6,
    SATURDAY = 7
}

/**
 * Fetch all Zone Hours attributed to a noted zone
 * @param zoneID ID of zone to filter by
 * @returns all Zone Hours for the noted zone
 */
export async function getHoursByZone(zoneID: number): Promise<ZoneHoursRow[]> {
    return await knex("OpenHours").select().where({zoneID}).orderBy("dayOfTheWeek", "asc").orderBy("time", "asc");
}

/**
 * Fetch all Zone Hours
 * @returns all Zone Hours
 */
export async function getZoneHours(): Promise<ZoneHoursRow[]> {
    return await knex("OpenHours").select().orderBy("zoneID", "desc").orderBy("dayOfTheWeek", "asc").orderBy("time", "asc");
}

/**
 * Insert new Zone Hours entry into table
 * @param zoneID ID of zone to apply to
 * @param type event type (i.e. "OPEN", "CLOSE")
 * @param dayOfTheWeek day of the week (represented by int 1-7) to apply to
 * @param time colon-seperated representation of 24-hour time
 * @returns new Zone Hours entry
 */
export async function createZoneHours(zoneID: number, type: string, dayOfTheWeek: WeekDays, time: string): Promise<ZoneHoursRow> {
    await knex("OpenHours").insert({zoneID, type, dayOfTheWeek, time});
    return await knex("OpenHours").select().orderBy("id", "desc").first();
}

/**
 * Delete a Zone Hours entry
 * @param id ID of Zone Hours entry to delete
 */
export async function deleteZoneHours(id: number): Promise<void> {
    await knex("OpenHours").delete().where({id});
}