import { knex } from "../../db";
import { AvailabilityRow } from "../../db/tables";
import {AvailabilityInput} from "../../schemas/availabilitySchema";

export async function getAvailabilityByDateAndUser(date: string, userID: number) {
    return knex('Availability')
        .select()
        .where({
            date: date,
            userID: userID
        })
        .orderBy('startTime', 'asc');
}

export async function getAvailabilityByDate(date: string) {
    return knex('Availability')
        .select()
        .where("date", date);
}

export async function createAvailabilitySlot(availability: AvailabilityInput): Promise<number> {
    const [slotID] = await knex('Availability').insert(
        {
            date: availability.date,
            startTime: availability.startTime,
            endTime: availability.endTime,
            userID: availability.userID
        },
        "id"
    );
    if (slotID == null) {
        throw new Error("Error creating availability slot: ID is null or undefined");
    }

    return slotID;
}

export async function updateAvailabilitySlot(id: string, availability: AvailabilityInput): Promise<number> {

    const [updatedCount] = await knex('Availability').where("id", id).update(
        {
            date: availability.date,
            startTime: availability.startTime,
            endTime: availability.endTime,
            userID: availability.userID
        },
        "id"
    );
    if (updatedCount == null) {
        throw new Error("Error updating availability slot: Updated count is null or undefined");
    }

    return +id;
}

export async function deleteAvailabilitySlot(id: string): Promise<boolean> {

    await knex("Availability").where("id", id).delete()
    return true
}