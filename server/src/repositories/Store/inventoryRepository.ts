import { knex } from "../../db";
import { InventoryItemMappper } from "../../mappers/store/InventoryItemMapper";
import { InventoryItem } from "../../models/store/inventoryItem";


export interface IInventoryRepo {
  getItemById(itemId: number | string): Promise<InventoryItem>;
  updateItemById(item: InventoryItem): Promise<InventoryItem>;
  addItem(item: InventoryItem): Promise<InventoryItem>;
  deleteItemById(questitemIdionId: number | string): Promise<void>
}

export class InventoryRepo implements IInventoryRepo {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
  }

  public async getItemById(itemId: number | string): Promise<InventoryItem> {
    const knexResult = await this.queryBuilder("InventoryItem")
      .leftJoin("InventoryItemLabel", "InventoryItemLabel.item", "=", "InventoryItem.id")
      .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
      .select(
        "InventoryItem.id",
        "InventoryItem.image",
        "InventoryItem.name",
        "InventoryItem.unit",
        "InventoryItem.pluralUnit",
        "InventoryItem.count",
        "InventoryItem.pricePerUnit",
        "Label.label",
      )
      .where("InventoryItem.id", itemId);
    return InventoryItemMappper.toDomain(knexResult)[0];
  }

  public async updateItemById(item: InventoryItem): Promise<InventoryItem> {
    const updateItem = await this.queryBuilder('InventoryItem')
      .where({ id: item.id })
      .update({
        name: item.name,
        image: item.image,
        unit: item.unit,
        pluralUnit: item.pluralUnit,
        count: item.count,
        pricePerUnit: item.pricePerUnit
      }, "id");

    this.updateLabels(item.id, item.labels);
    return InventoryItemMappper.toDomain(this.getItemById(updateItem[0]))[0];
  }

  public async addItem(item: InventoryItem): Promise<InventoryItem> {
    const newId = await this.queryBuilder("InventoryItem")
      .insert({
        image: item.image,
        name: item.name,
        unit: item.unit,
        pluralUnit: item.pluralUnit,
        count: item.count,
        pricePerUnit: item.pricePerUnit
      }, "id");
    this.updateLabels(newId, item.labels);
    return InventoryItemMappper.toDomain(newId)[0];
  }

  public async deleteItemById(itemId: number | string): Promise<void> {
    await this.queryBuilder("InventoryItem").where({ id: itemId }).del();
  }

  private async updateLabels(itemId: number, labels: string[]): Promise<void> {
    await this.queryBuilder('InventoryItemLabel').where('item', itemId).del();
    await this.queryBuilder.from('InventoryItemLabel')
      .insert(
        this.queryBuilder.from('Label')
          .whereIn('Label.label', labels)
          .select(knex.raw('? AS ??', [itemId, 'item']), 'Label.id')
      );
  }

}