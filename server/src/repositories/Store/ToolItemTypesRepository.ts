import { knex } from "../../db/index.js";
import { ToolItemTypesRow } from "../../db/tables.js";

export async function getToolItemTypes(): Promise<ToolItemTypesRow[]> {
    return await knex("ToolItemTypes").select();
}

export async function getToolItemTypesWhereAllowCheckout(): Promise<ToolItemTypesRow[]> {
    return await knex("ToolItemTypes").select().where({allowCheckout: true});
}

export async function getToolItemTypeByID(id: number): Promise<ToolItemTypesRow | undefined> {
    return await knex("ToolItemTypes").select().where({id}).first();
}

export async function createToolItemType(name: string, defaultLocationRoomID: number | undefined, defaultLocationDescription: string | undefined, description: string | undefined, checkoutNote: string | undefined, checkinNote: string | undefined, allowCheckout: boolean): Promise<ToolItemTypesRow> {
    return await knex("ToolItemTypes").insert({name, defaultLocationRoomID, defaultLocationDescription, description, checkoutNote, checkinNote, allowCheckout});
}

export async function updateToolItemType(id: number, name: string, defaultLocationRoomID: number | undefined, defaultLocationDescription: string | undefined, description: string | undefined, checkoutNote: string | undefined, checkinNote: string | undefined, allowCheckout: boolean): Promise<ToolItemTypesRow | undefined> {
    return await knex("ToolItemTypes").update({name, defaultLocationRoomID, defaultLocationDescription, description, checkoutNote, checkinNote, allowCheckout}).where({id}).returning("*").first();
}

export async function deleteToolItemType(id: number): Promise<boolean> {
    await knex("ToolItemTypes").delete().where({id});
    return true;
}