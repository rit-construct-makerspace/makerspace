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

export async function getHoursByZone(zone: string): Promise<ZoneHoursRow[]> {
    return await knex("OpenHours").select().where({zone});
}