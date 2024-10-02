import { knex } from "../../db/index.js";
import { InventoryLedgerRow } from "../../db/tables.js";
import { InventoryItem } from "../../schemas/storeFrontSchema.js";

export async function getLedgers(
    startDate: string,
    stopDate: string,
    searchText: string
): Promise<InventoryLedgerRow[]> {
    return await knex("InventoryLedger")
        .select()
        .whereRaw(`("timestamp" at time zone 'EST5EDT') BETWEEN TIMESTAMP '${startDate}' AND TIMESTAMP '${stopDate}'`)
        .whereRaw(searchText != "" ? `items::TEXT ilike %${searchText}%` : ``)
        .orderBy("timestamp", "DESC");
}

export async function deleteLedger(id: number): Promise<boolean> {
    await knex("InventoryLedger").delete().where({id});
    return true;
}

export async function createLedger(
    initiator: number,
    category: string,
    totalCost: number,
    purchaser: number | undefined,
    notes: string,
    items: {name: string, quantity: number}[]): Promise<InventoryLedgerRow> {
    const itemsJSON = JSON.stringify(items);
    return await knex("InventoryLedger").insert({timestamp: knex.fn.now(), initiator, category, totalCost, purchaser, notes, items: itemsJSON});
}