import { knex } from "../../db";
import {
  inventoryItemstoDomain,
  singleInventoryItemtoDomain,
} from "../../mappers/store/InventoryItemMapper";
import { InventoryItem } from "../../models/store/inventoryItem";
import { InventoryItemInput } from "../../models/store/inventoryItemInput";

export interface IInventoryRepository {
  getItems(): Promise<InventoryItem[]>;
  getItemById(itemId: number): Promise<InventoryItem | null>;
  updateItemById(
    itemId: number,
    item: InventoryItemInput
  ): Promise<InventoryItem | null>;
  addItem(item: InventoryItemInput): Promise<InventoryItem | null>;
  addItemAmount(itemId: number, amount: number): Promise<InventoryItem | null>;
  deleteItemById(questitemIdionId: number): Promise<void>;
  addLabels(itemId: number, labels: string[]): Promise<void>;
  getLabels(itemId: number): Promise<string[] | null>;
}

export class InventoryRepository implements IInventoryRepository {
  private queryBuilder;

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex;
  }

  public async getLabels(itemId: number): Promise<string[] | null> {
    const knexResult = await this.queryBuilder("InventoryItemLabel")
      .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
      .select("Label.label")
      .where("InventoryItemLabel.item", itemId);
    const result = knexResult.map((i: any) => i.label);
    if (result.length === 1 && result[0] === null) return null;
    return result;
  }

  public async getItems(): Promise<InventoryItem[]> {
    const knexResult = await this.queryBuilder("InventoryItem").select(
      "InventoryItem.id",
      "InventoryItem.image",
      "InventoryItem.name",
      "InventoryItem.unit",
      "InventoryItem.pluralUnit",
      "InventoryItem.count",
      "InventoryItem.pricePerUnit",
      "InventoryItem.threshold"
    );
    return inventoryItemstoDomain(knexResult);
  }

  public async getItemById(itemId: number): Promise<InventoryItem | null> {
    const knexResult = await this.queryBuilder
      .first(
        "id",
        "image",
        "name",
        "unit",
        "pluralUnit",
        "count",
        "pricePerUnit",
        "InventoryItem.threshold"
      )
      .from("InventoryItem")
      .where("id", itemId);

    return singleInventoryItemtoDomain(knexResult);
  }

  public async updateItemById(
    itemId: number,
    item: InventoryItemInput
  ): Promise<InventoryItem | null> {
    const updateItem = await this.queryBuilder("InventoryItem")
      .where({ id: itemId })
      .update({
        name: item.name,
        image: item.image,
        unit: item.unit,
        pluralUnit: item.pluralUnit,
        count: item.count,
        pricePerUnit: item.pricePerUnit,
        threshold: item.threshold
      });

    this.setLabels(itemId, item.labels);
    return await this.getItemById(itemId);
  }

  public async addItem(
    item: InventoryItemInput
  ): Promise<InventoryItem | null> {
    const newId = (
      await this.queryBuilder("InventoryItem").insert(
        {
          image: item.image,
          name: item.name,
          unit: item.unit,
          pluralUnit: item.pluralUnit,
          count: item.count,
          pricePerUnit: item.pricePerUnit,
          threshold: item.threshold
        },
        "id"
      )
    )[0];
    if (item.labels && item.labels.length > 0)
      await this.addLabels(newId, item.labels);
    return await this.getItemById(newId);
  }

  public async addItemAmount(
    itemId: number,
    amount: number
  ): Promise<InventoryItem | null> {
    const updateItem = (
      await this.queryBuilder("InventoryItem")
        .where({ id: itemId })
        .update(
          {
            count: knex.raw(`?? + ${amount}`, ["count"]),
          },
          "id"
        )
    )[0];

    return await this.getItemById(updateItem);
  }

  public async deleteItemById(itemId: number): Promise<void> {
    await this.queryBuilder("InventoryItem").where({ id: itemId }).del();
  }

  public async addLabels(itemId: number, labels: string[]): Promise<void> {
    await this.queryBuilder
      .into(knex.raw("?? (??, ??)", ["InventoryItemLabel", "item", "label"]))
      .insert(
        this.queryBuilder
          .from("Label")
          .whereIn("Label.label", labels)
          .select(knex.raw("? AS ??", [itemId, "item"]), "Label.id AS label")
      );
  }

  public async setLabels(itemId: number, labels: string[]): Promise<void> {
    await this.queryBuilder("InventoryItemLabel").del().where({ item: itemId });
    if (labels && labels.length > 0) await this.addLabels(itemId, labels);
  }

  public async removeLabels(itemId: number, labels: string[]): Promise<void> {
    const subquery = this.queryBuilder
      .select("id")
      .from("Label")
      .whereIn("label", labels);

    await this.queryBuilder("InventoryItemLabel")
      .where("item", "=", itemId)
      .whereIn("label", subquery)
      .del();
  }
}
