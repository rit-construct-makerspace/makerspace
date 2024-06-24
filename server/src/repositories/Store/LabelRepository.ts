/** LabelRepository.ts
 * DB operations endpoint for Labels table
 */

import { knex } from "../../db";
import { getEquipmentByID } from "../Equipment/EquipmentRepository";

/**
 * Fetch all labels in table
 * @returns {string[]} labels
 */
export async function getAllLabels(): Promise<string[]> {
  const knexResult = await knex("Label").select("label");
  return knexResult.map((i: any) => i.label);
}

/**
 * Fetch all labels for a specified item
 * @param itemId ID of item to find labels for
 * @returns {string[]} all Labels found
 */
export async function getLabelsForItem(itemId: number): Promise<string[]> {
  return knex("InventoryItem")
    .leftJoin(
      "InventoryItemLabel",
      "InventoryItemLabel.item",
      "=",
      "InventoryItem.id"
    )
    .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
    .select("Label.label")
    .where("InventoryItem.id", itemId);
}

/**
 * Append a label to the table
 * @param label the label to be added
 */
export async function addLabel(label: string): Promise<void> {
  await knex("Label").insert({ label });
}

/**
 * Archive a label
 * @param label the label to be archived
 */
export async function archiveLabel(label: string): Promise<void> {
  await knex("Label").where({ label }).update({ archived: true });
}

/**
 * Archive a label
 * @param labelId the ID of the label to archive
 */
export async function archiveLabelById(labelId: number): Promise<void> {
  await knex("Label").where({ id: labelId }).update({ archived: true });
}
