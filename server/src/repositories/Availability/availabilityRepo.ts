import { knex } from "../../db";
import { AvailabilityRow } from "../../db/tables";

export async function getAllAvailability(date: string, userID: number) {
    return knex('Availability')
        .select()
        .where("date", new Date(date));
}

export async function createAvailabilitySlot(date: Date, startTime: Date, endTime: Date, userID: number): Promise<AvailabilityRow[]> {
    return knex('Availability').insert(
        {
            date: date,
            startTime: startTime,
            endTime: endTime,
            userID: userID
        },
        "id"
    );
}