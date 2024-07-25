import { knex } from "../../db";
import { ReaderRow } from "../../db/tables";

/**
 * Fetch a card ready buy it's primary key
 * @param id the primary id of the reader
 */
export async function getReaderByID(
    id: number
): Promise<ReaderRow | undefined> {
    return await knex("Readers").first().where({ id: id });
}

/**
 * Fetch areader by the id of the machine it is associated with
 * @param machineID the machine ID of the machine
 */
export async function getReaderByMachineID(
    machineID: number
): Promise<ReaderRow | undefined> {
    return await knex("Readers").from("Readers").first().where({ machineID: machineID });
}

/**
 * Fetch all card readers
 */
export async function getReaders(): Promise<ReaderRow[]> {
    return await knex("Readers").select("*").orderBy("id", "asc"); //Order them to prevent random ordering everytime the client polls
}

/**
 * Create a card reader using the non-status attributes
 * @param reader the static attributes of the card reader
 */
export async function createReader(reader: {
    machineID?: number,
    machineType?: string,
    name?: string,
    zone?: string
}): Promise<ReaderRow | undefined> {
    const [newID] = await knex("Readers").insert(reader, "id");
    return await getReaderByID(newID);
}

/**
 * Modify a reader row
 * @param reader the reader attributes
 */
export async function updateReaderStatus(reader: {
    id: number,
    machineID: number,
    machineType: string,
    zone: string,
    temp: number,
    state: string,
    currentUID: string,
    recentSessionLength: number,
    lastStatusReason: string,
    scheduledStatusFreq: number,
}): Promise<ReaderRow | undefined> {
    await knex("Readers").where({ id: reader.id }).update({
        machineID: reader.machineID,
        machineType: reader.machineType,
        zone: reader.zone,
        temp: reader.temp,
        state: reader.state,
        currentUID: reader.currentUID,
        recentSessionLength: reader.recentSessionLength,
        lastStatusReason: reader.lastStatusReason,
        scheduledStatusFreq: reader.scheduledStatusFreq,
        lastStatusTime: knex.fn.now()
    })

    return getReaderByID(reader.id);
}

/**
 * Change the name of a reader at id
 * @param id the id of the reader to modify
 * @param name the updated name of the reader
 */
export async function setReaderName(
    id: number, 
    name: string
): Promise<ReaderRow | undefined> {
    await knex("Readers").where({ id: id }).update({ name });
    return await getReaderByID(id);
}