import { knex } from "../../db/index.js";
import { ToolItemInstancesRow } from "../../db/tables.js";

export async function getToolItemInstances(): Promise<ToolItemInstancesRow[]> {
    return await knex("ToolItemInstances").select().orderBy("id");
}

export async function getToolItemInstancesByType(typeID: number): Promise<ToolItemInstancesRow[]> {
    return await knex("ToolItemInstances").select().where({typeID}).orderBy("id");
}

export async function getToolItemInstanceByID(id: number): Promise<ToolItemInstancesRow | undefined> {
    return await knex("ToolItemInstances").select().where({id}).first();
}

export async function getToolItemInstancesByBorrower(borrowerUserID: number): Promise<ToolItemInstancesRow[]> {
    return await knex("ToolItemInstances").select().where({borrowerUserID});
}

export async function createToolItemInstance(typeID: number, uniqueIdentifier: string, locationRoomID: number | undefined, locationDescription: string | undefined, condition: string, status: string, notes: string | undefined): Promise<ToolItemInstancesRow> {
    return await knex("ToolItemInstances").insert({typeID, uniqueIdentifier, locationRoomID, locationDescription, condition, status, notes});
}

export async function updateToolItemInstance(id: number, typeID: number, uniqueIdentifier: string, locationRoomID: number | undefined, locationDescription: string | undefined, condition: string, status: string, notes: string | undefined): Promise<ToolItemInstancesRow | undefined> {
    return (await knex("ToolItemInstances").update({typeID, uniqueIdentifier, locationRoomID, locationDescription, condition, status, notes}).where({id}).returning("*"))[0];
}

export async function deleteToolItemInstance(id: number): Promise<boolean> {
    await knex("ToolItemInstances").delete().where({id});
    return true;
}

export async function borrowItem(borrowerUserID: number, id: number): Promise<boolean> {
    await knex("ToolItemInstances").update({borrowerUserID, borrowedAt: knex.fn.now(), status: "OUT"}).where({id});
    return true;
}

export async function returnItem(id: number): Promise<boolean> {
    await knex("ToolItemInstances").update({borrowerUserID: null, borrowedAt: null, status: "AVAILABLE"}).where({id});
    return true;
}