import knex from "knex";
import { PurchaseOrderMappper } from "../../mappers/store/PurchaseOrderMapper";
import { InventoryItem } from "../../models/store/inventoryItem";
import { PurchaseOrder } from "../../models/store/purchaseOrder";
import { PurchaseOrderItemInput } from "../../models/store/purchaseOrderItemInput";

export interface IPurchaseOrderRepo {
  getAllPOs(): Promise<PurchaseOrder[]>;
  getPOById(poId: number | string): Promise<PurchaseOrder>;
  createNewPO(creatorId: number, expectedDeliveryDate: Date, items: PurchaseOrderItemInput[], attachments: string[]): Promise<PurchaseOrder>;
  addItemToPO(item: InventoryItem, poId: number, count: number): Promise<PurchaseOrder>;
  addItemsToPO(poId: number, items: PurchaseOrderItemInput[]): Promise<PurchaseOrder>;
  addAttachmentToPO(attachment: string, poId: number | string): Promise<PurchaseOrder>;
  addAttachmentsToPO(attachments: string[], poId: number): Promise<PurchaseOrder>;
  removeAttachmentFromPO(attachment: string, poId: number | string): Promise<PurchaseOrder>;
  removeItemFromPO(itemId: number | string, poId: number | string): Promise<PurchaseOrder>;
  updateItemCountInPO(itemId: number | string, count: number, poId: number | string): Promise<PurchaseOrder>;
  deletePOById(poId: number | string): Promise<void>;
}


export class PurchaseOrderRepo implements IPurchaseOrderRepo {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
  }

  public async getAllPOs(): Promise<PurchaseOrder[]> {
    const knexResult = await this.queryBuilder("PurchaseOrder")
      .leftJoin("PurchaseOrderItem", "PurchaseOrderItem.purchaseOrder", "=", "PurchaseOrder.id")
      .leftJoin("PurchaseOrderAttachment", "PurchaseOrderAttachment.purchaseOrder", "=", "PurchaseOrder.id")
      .leftJoin("InventoryItem", "InventoryItem.id", "=", "PurchaseOrderItem.item")
      .select(
        "PurchaseOrder.id",
        "PurchaseOrder.creator",
        "PurchaseOrder.createDate",
        "PurchaseOrder.expectedDeliveryDate",
        "PurchaseOrderItem.id as itemId",
        "PurchaseOrderItem.item",
        "InventoryItem.id as invItemId",
        "InventoryItem.image",
        "InventoryItem.name",
        "InventoryItem.unit",
        "InventoryItem.pluralUnit",
        "InventoryItem.count",
        "InventoryItem.pricePerUnit",
        "Label.label",
        "PurchaseOrderItem.count as poItemCount",
        "PurchaseOrderAttachment.id as attachId",
        "PurchaseOrderAttachment.attachment"
      )
    return PurchaseOrderMappper.toDomain(knexResult);
  }

  public async getPOById(poId: number | string): Promise<PurchaseOrder> {
    const knexResult = await this.queryBuilder("PurchaseOrder")
      .leftJoin("PurchaseOrderItem", "PurchaseOrderItem.purchaseOrder", "=", "PurchaseOrder.id")
      .leftJoin("PurchaseOrderAttachment", "PurchaseOrderAttachment.purchaseOrder", "=", "PurchaseOrder.id")
      .leftJoin("InventoryItem", "InventoryItem.id", "=", "PurchaseOrderItem.item")
      .select(
        "PurchaseOrder.id",
        "PurchaseOrder.creator",
        "PurchaseOrder.createDate",
        "PurchaseOrder.expectedDeliveryDate",
        "PurchaseOrderItem.id as itemId",
        "PurchaseOrderItem.item",
        "InventoryItem.id as invItemId",
        "InventoryItem.image",
        "InventoryItem.name",
        "InventoryItem.unit",
        "InventoryItem.pluralUnit",
        "InventoryItem.count",
        "InventoryItem.pricePerUnit",
        "Label.label",
        "PurchaseOrderItem.count as poItemCount",
        "PurchaseOrderAttachment.id as attachId",
        "PurchaseOrderAttachment.attachment"
      )
      .where("PurchaseOrder.id", poId);
    return PurchaseOrderMappper.toDomain(knexResult)[0];
  }

  public async createNewPO(creatorId: number, expectedDeliveryDate: Date, items: PurchaseOrderItemInput[], attachments: string[]): Promise<PurchaseOrder> {
    const newId = await this.queryBuilder("PurchaseOrder")
    .insert({
      creator: creatorId,
      createDate: Date.now(),
      expectedDeliveryDate: expectedDeliveryDate,
    }, "id");

    if (items.length > 0) {
     this.addItemsToPO(newId, items);
    }

    if (attachments.length > 0) {
      this.addAttachmentsToPO(attachments, newId);
    }

    return this.getPOById(newId);
  }

  public async addItemToPO(item: InventoryItem, poId: number, count: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .insert({
        item: item.id,
        purchaseOrder: poId,
        count: count,
      });
    return this.getPOById(poId);
  }

  public async addItemsToPO(poId: number, items: PurchaseOrderItemInput[]): Promise<PurchaseOrder> {

    const batchInsert = items.map((i) => ({
      purchaseOrder: poId,
      item: i.itemId,
      count: i.count,
    }));

    await this.queryBuilder("PurchaseOrderItem")
      .insert(batchInsert);

    return this.getPOById(poId);
  }

  public async addAttachmentToPO(attachment: string, poId: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderAttachment")
      .insert({
        purchaseOrder: poId,
        attachment: attachment,
      });
    return this.getPOById(poId);
  }

  public async addAttachmentsToPO(attachments: string[], poId: number): Promise<PurchaseOrder> {

    const batchInsert = attachments.map((i) => ({
      purchaseOrder: poId,
      attachment: i
    }));

    await this.queryBuilder("PurchaseOrderAttachment")
      .insert(batchInsert);
    return this.getPOById(poId);
  }

  public async removeAttachmentFromPO(attachment: string, poId: number | string): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderAttachment")
      .where({
        purchaseOrder: poId,
        attachment: attachment,
      }).del();
    return this.getPOById(poId);
  }

  public async removeItemFromPO(itemId: number | string, poId: number | string): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .where({
        purchaseOrder: poId,
        item: itemId,
      }).del();
    return this.getPOById(poId);
  }

  public async updateItemCountInPO(itemId: number | string, count: number, poId: number | string): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .where({
        purchaseOrder: poId,
        item: itemId,
      }).update({ count: count });
    return this.getPOById(poId);
  }

  public async deletePOById(poId: number | string): Promise<void> {
    await this.queryBuilder("PurchaseOrder")
      .where({
        purchaseOrder: poId,
      }).del();
  }

}