import { knex } from "../../db";
import { AvailabilityRow } from "../../db/tables";
import {AvailabilityInput} from "../../schemas/availabilitySchema";

export async function getAllAvailability(date: string, userID: number) {
    return knex('Availability')
        .select()
        .where("date", new Date(date));
}

export async function createAvailabilitySlot(availability: AvailabilityInput): Promise<AvailabilityRow[]> {
    return knex('Availability').insert(
        {
            date: availability.date,
            startTime: availability.startTime,
            endTime: availability.endTime,
            userID: availability.userID
        },
        "id"
    );
}