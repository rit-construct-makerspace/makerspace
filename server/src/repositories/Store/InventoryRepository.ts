/** InventoryRepository.ts
 * DB operations endpoint for Holds table
 */

import { knex } from "../../db/index.js";
import { InventoryItemRow, InventoryTagRow } from "../../db/tables.js";
import { EntityNotFound } from "../../EntityNotFound.js";
import {
  inventoryItemsToDomain,
  singleInventoryItemToDomain,
} from "../../mappers/store/InventoryItemMapper.js";
import {
  InventoryItem,
  InventoryItemInput,
} from "../../schemas/storeFrontSchema.js";

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

export async function getTags(): Promise<InventoryTagRow[]> {
  return await knex("InventoryTags").select();
}

export async function getTagByID(id: number): Promise<InventoryTagRow | undefined> {
  return await knex("InventoryTags").select().where({id}).first();
}

export async function addTagToItem(itemID: number, tagID: number): Promise<boolean> {
  const item = await knex("InventoryItem").select().where({id: itemID}).first();
  if (!item?.tagID1) await knex("InventoryItem").update({tagID1: tagID}).where({id: itemID});
  else if (!item?.tagID2) await knex("InventoryItem").update({tagID2: tagID}).where({id: itemID});
  else if (!item?.tagID3) await knex("InventoryItem").update({tagID3: tagID}).where({id: itemID});
  else return false;
  return true;
}

export async function removeTagFromItem(itemID: number, tagID: number): Promise<boolean> {
  const item = await knex("InventoryItem").select().where({id: itemID}).first();
  if (item?.tagID1 == tagID) await knex("InventoryItem").update({tagID1: null});
  else if (item?.tagID2 == tagID) await knex("InventoryItem").update({tagID2: null});
  else if (item?.tagID3 == tagID) await knex("InventoryItem").update({tagID3: null});
  return true;
}

export async function createTag(label: string, color: string): Promise<boolean> {
  await knex("InventoryTags").insert({label, color});
  return true;
}

export async function updateTag(id: number, label: string, color: string): Promise<boolean> {
  await knex("InventoryTags").update({label, color}).where({id});
  return true
}

export async function deleteTag(id: number): Promise<boolean> {
  await knex("InventoryTags").delete().where({id});
  return true;
}