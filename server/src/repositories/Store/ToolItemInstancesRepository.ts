import { knex } from "../../db/index.js";
import { ToolItemInstancesRow } from "../../db/tables.js";

export async function getToolItemInstances(): Promise<ToolItemInstancesRow[]> {
    return await knex("ToolItemInstances").select();
}

export async function getToolItemInstancesByType(typeID: number): Promise<ToolItemInstancesRow[]> {
    return await knex("ToolItemInstances").select().where({typeID});
}

export async function getToolItemTypeByID(id: number): Promise<ToolItemInstancesRow | undefined> {
    return await knex("ToolItemInstances").select().where({id}).first();
}

export async function createToolItemInstance(typeID: number, uniqueIdentifier: string, locationRoomID: number | undefined, locationDescription: string | undefined, condition: string, status: string, notes: string | undefined): Promise<ToolItemInstancesRow> {
    return await knex("ToolItemInstances").insert({typeID, uniqueIdentifier, locationRoomID, locationDescription, condition, status, notes});
}

export async function updateToolItemInstance(id: number, typeID: number, uniqueIdentifier: string, locationRoomID: number | undefined, locationDescription: string | undefined, condition: string, status: string, notes: string | undefined): Promise<ToolItemInstancesRow | undefined> {
    return await knex("ToolItemInstances").update({typeID, uniqueIdentifier, locationRoomID, locationDescription, condition, status, notes}).where({id}).returning("*").first();
}

export async function deleteToolItemInstance(id: number): Promise<boolean> {
    await knex("ToolItemInstances").delete().where({id});
    return true;
}