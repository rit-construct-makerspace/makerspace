import { knex } from "../../db";
import { inventoryItemstoDomain, singleInventoryItemtoDomain } from "../../mappers/store/InventoryItemMapper";
import { InventoryItem } from "../../models/store/inventoryItem";
import { InventoryItemInput } from "../../models/store/inventoryItemInput";

export interface IInventoryRepository {
  getItems(): Promise<InventoryItem[]>;
  getItemById(itemId: number): Promise<InventoryItem>;
  updateItemById(itemId: number, item: InventoryItemInput): Promise<InventoryItem>;
  addItem(item: InventoryItemInput): Promise<InventoryItem>;
  addItemAmount(itemId: number, amount: number): Promise<InventoryItem>;
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
    const knexResult = await this.queryBuilder("InventoryItem")
      .leftJoin(
        "InventoryItemLabel",
        "InventoryItemLabel.item",
        "=",
        "InventoryItem.id"
      )
      .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
      .select("Label.label").where("InventoryItem.id", itemId);
    const result = knexResult.map((i: any) => i.label)
    if (result.length === 1 && result[0] === null)
      return null;
    return result;
  }

  public async getItems(): Promise<InventoryItem[]> {
    const knexResult = await this.queryBuilder("InventoryItem")
      .select(
        "InventoryItem.id",
        "InventoryItem.image",
        "InventoryItem.name",
        "InventoryItem.unit",
        "InventoryItem.pluralUnit",
        "InventoryItem.count",
        "InventoryItem.pricePerUnit"
      );
    return inventoryItemstoDomain(knexResult);
  }

  public async getItemById(itemId: number): Promise<InventoryItem> {
    const knexResult = await this.queryBuilder
      .select(
        "id",
        "image",
        "name",
        "unit",
        "pluralUnit",
        "count",
        "pricePerUnit",
      )
      .from("InventoryItem")
      .where("InventoryItem.id", itemId).first();

    return singleInventoryItemtoDomain(knexResult);
  }

  public async updateItemById(itemId: number, item: InventoryItemInput): Promise<InventoryItem> {
    const updateItem = await this.queryBuilder("InventoryItem")
      .where({ id: itemId })
      .update(
        {
          name: item.name,
          image: item.image,
          unit: item.unit,
          pluralUnit: item.pluralUnit,
          count: item.count,
          pricePerUnit: item.pricePerUnit,
        },
        "id"
      );

    this.setLabels(itemId, item.labels);
    return await this.getItemById(updateItem[0]);

  }

  public async addItem(item: InventoryItemInput): Promise<InventoryItem> {
    const newId = (
      await this.queryBuilder("InventoryItem").insert(
        {
          image: item.image,
          name: item.name,
          unit: item.unit,
          pluralUnit: item.pluralUnit,
          count: item.count,
          pricePerUnit: item.pricePerUnit,
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
  ): Promise<InventoryItem> {
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
    await this.queryBuilder.from("InventoryItemLabel").insert(
      this.queryBuilder
        .from("Label")
        .whereIn("Label.label", labels)
        .select(knex.raw("? AS ??", [itemId, "item"]), "Label.id")
    );
  }

  public async setLabels(itemId: number, labels: string[]): Promise<void> {
    await this.queryBuilder("InventoryItemLabel").del().where({ item: itemId });
    await this.addLabels(itemId, labels);
  }

  public async removeLabels(itemId: number, labels: string[]): Promise<void> {
    await this.queryBuilder.from("InventoryItemLabel")
      .whereIn('label', () => {
        this.queryBuilder.select('id')
          .from('Label')
          .whereIn('label', labels);
      })
      .del()
  }
}
