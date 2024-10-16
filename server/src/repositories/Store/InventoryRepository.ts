/** InventoryRepository.ts
 * DB operations endpoint for Holds table
 */

import { knex } from "../../db/index.js";
import { InventoryItemRow } from "../../db/tables.js";
import { EntityNotFound } from "../../EntityNotFound.js";
import {
  inventoryItemsToDomain,
  singleInventoryItemToDomain,
} from "../../mappers/store/InventoryItemMapper.js";
import {
  InventoryItem,
  InventoryItemInput,
} from "../../schemas/storeFrontSchema.js";
export async function getLabels(itemId: number): Promise<string[] | null> {
  const knexResult = await knex("InventoryItemLabel")
    .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
    .select("Label.label")
    .where("InventoryItemLabel.item", itemId);
  const result = knexResult.map((i: any) => i.label);
  if (result.length === 1 && result[0] === null) return null;
  return result;
}

export async function getItems(): Promise<InventoryItem[]> {
  const knexResult = await knex("InventoryItem").select().where('archived', false);
  return inventoryItemsToDomain(knexResult);
}

export async function getItemsWhereStaff(staffOnly: boolean): Promise<InventoryItem[]> {
  return inventoryItemsToDomain(await knex("InventoryItem").select().where({staffOnly}));
}

export async function getItemsWhereStorefront(storefrontVisible: boolean): Promise<InventoryItem[]> {
  return inventoryItemsToDomain(await knex("InventoryItem").select().where({storefrontVisible}));
}

export async function getItemByIdWhereStorefront(
  id: number,
  storefrontVisible: boolean
): Promise<InventoryItem | null> {
  return singleInventoryItemToDomain(await knex("InventoryItem").select().where({id, storefrontVisible}));
}

export async function getItemById(
  itemId: number
): Promise<InventoryItem | null> {
  const knexResult = await knex
    .first()
    .from("InventoryItem")
    .where("id", itemId);

  return singleInventoryItemToDomain(knexResult);
}

export async function updateItemById(
  itemId: number,
  item: InventoryItemInput
): Promise<InventoryItem | null> {
  await knex("InventoryItem").where({ id: itemId }).update({
    name: item.name,
    image: item.image,
    unit: item.unit,
    pluralUnit: item.pluralUnit,
    count: item.count,
    pricePerUnit: item.pricePerUnit,
    threshold: item.threshold,
    notes: item.notes
  });

  await setLabels(itemId, item.labels);
  return await getItemById(itemId);
}

export async function addItem(
  item: InventoryItemInput
): Promise<InventoryItem | null> {
  const newId = (
    await knex("InventoryItem").insert(
      {
        image: item.image,
        name: item.name,
        unit: item.unit,
        pluralUnit: item.pluralUnit,
        count: item.count,
        pricePerUnit: item.pricePerUnit,
        threshold: item.threshold,
        notes: item.notes
      },
      "id"
    )
  )[0];
  if (item.labels && item.labels.length > 0)
    await addLabels(newId.id, item.labels);
  return await getItemById(newId.id);
}

export async function addItemAmount(
  itemId: number,
  amount: number
): Promise<InventoryItem | null> {
  const updateItem = (
    await knex("InventoryItem")
      .where({ id: itemId })
      .update(
        {
          count: knex.raw(`?? + ${amount}`, ["count"]),
        },
        "id"
      )
  )[0];

  return await getItemById(updateItem.id);
}

export async function archiveItem(
  itemId: number
): Promise<InventoryItem | null> {
  let updatedInventoryItems: InventoryItem[] = await knex("InventoryItem").where({ id: itemId }).update({ archived: true });

  if (updatedInventoryItems.length < 1) throw new EntityNotFound(`Could not find inventory item #${itemId}`);

  return updatedInventoryItems[0];
}

export async function addLabels(
  itemId: number,
  labels: string[]
): Promise<void> {
  await knex
    .into(knex.raw("?? (??, ??)", ["InventoryItemLabel", "item", "label"]))
    .insert(
      knex
        .from("Label")
        .whereIn("Label.label", labels)
        .select(knex.raw("? AS ??", [itemId, "item"]), "Label.id AS label")
    );
}

export async function setLabels(
  itemId: number,
  labels: string[]
): Promise<void> {
  await knex("InventoryItemLabel").del().where({ item: itemId });
  if (labels && labels.length > 0) await addLabels(itemId, labels);
}

export async function removeLabels(
  itemId: number,
  labels: string[]
): Promise<void> {
  const subquery = knex.select("id").from("Label").whereIn("label", labels);

  await knex("InventoryItemLabel")
    .where("item", "=", itemId)
    .whereIn("label", subquery)
    .del();
}

export async function deleteInventoryItem(
    itemId: number
): Promise<boolean> {
    await knex("InventoryItem").where({ id: itemId}).delete()
    return true
}

export async function setStorefrontVisible(id: number, storefrontVisible: boolean): Promise<boolean> {
  await knex("InventoryItem").update({storefrontVisible}).where({id});
  return true;
}

export async function setStaffOnly(id: number, staffOnly: boolean): Promise<boolean> {
  await knex("InventoryItem").update({staffOnly}).where({id});
  return true;
}