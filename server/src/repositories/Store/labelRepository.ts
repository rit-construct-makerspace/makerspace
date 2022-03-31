import { knex } from "../../db";
import { getEquipmentByID } from "../Equipment/EquipmentRepository";

export async function getAllLabels(): Promise<string[]> {
  const knexResult = await knex("Label").select("label");
  return knexResult.map((i: any) => i.label);
}

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

export async function addLabel(label: string): Promise<void> {
  await knex("Label").insert({ label });
}

export async function archiveLabel(label: string): Promise<void> {
  await knex("Label").where({ label }).update({ archived: true });
}

export async function archiveLabelById(labelId: number): Promise<void> {
  await knex("Label").where({ id: labelId }).update({ archived: true });
}
