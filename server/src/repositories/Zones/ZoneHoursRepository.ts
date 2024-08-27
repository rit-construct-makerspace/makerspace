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

export async function getHoursByZone(zoneID: number): Promise<ZoneHoursRow[]> {
    return await knex("OpenHours").select().where({zoneID});
}

export async function getZoneHours(): Promise<ZoneHoursRow[]> {
    return await knex("OpenHours").select().orderBy("zoneID", "desc").orderBy("dayOfTheWeek", "asc").orderBy("time", "asc");
}

export async function createZoneHours(zoneID: number, type: string, dayOfTheWeek: WeekDays, time: string): Promise<ZoneHoursRow> {
    await knex("OpenHours").insert({zoneID, type, dayOfTheWeek, time});
    return await knex("OpenHours").select().orderBy("id", "desc").first();
}

export async function deleteZoneHours(id: number): Promise<void> {
    await knex("OpenHours").delete().where({id});
}