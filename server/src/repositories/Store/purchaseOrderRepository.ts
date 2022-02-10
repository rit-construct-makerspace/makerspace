import { knex } from "../../db";
import { purchaseOrderItemsToDomain } from "../../mappers/store/PurchaseOrderItemMapper";
import { purchaseOrdersToDomain, singlePurchaseOrderToDomain } from "../../mappers/store/PurchaseOrderMapper";
import { InventoryItem } from "../../models/store/inventoryItem";
import { PurchaseOrder } from "../../models/store/purchaseOrder";
import { PurchaseOrderItem } from "../../models/store/purchaseOrderItem";
import { PurchaseOrderItemInput } from "../../models/store/purchaseOrderItemInput";

export interface IPurchaseOrderRepository {
  getAllPOs(): Promise<PurchaseOrder[]>;
  getPOById(poId: number): Promise<PurchaseOrder>;
  getPOItemsById(poId: number): Promise<PurchaseOrderItem[]>;
  createNewPO(creatorId: number, expectedDeliveryDate: Date, items: PurchaseOrderItemInput[], attachments: string[]): Promise<PurchaseOrder>;
  addItemToPO(item: InventoryItem, poId: number, count: number): Promise<PurchaseOrder>;
  addItemsToPO(poId: number, items: PurchaseOrderItemInput[]): Promise<PurchaseOrder>;
  getAttachmentsById(poId: number): Promise<string[]>;
  addAttachmentToPO(attachment: string, poId: number): Promise<PurchaseOrder>;
  addAttachmentsToPO(attachments: string[], poId: number): Promise<PurchaseOrder>;
  removeAttachmentFromPO(attachment: string, poId: number): Promise<PurchaseOrder>;
  removeItemFromPO(itemId: number, poId: number): Promise<PurchaseOrder>;
  updateItemCountInPO(itemId: number, count: number, poId: number): Promise<PurchaseOrder>;
  deletePOById(poId: number): Promise<void>;
}


export class PurchaseOrderRepository implements IPurchaseOrderRepository {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
  }

  public async getAttachmentsById(poId: number): Promise<string[]> {
    const knexResult = await this.queryBuilder("PurchaseOrderAttachment")
      .select(
        "attachment"
      )
      .where("id", poId);
    const result = knexResult.map((i: any) => i.attachment)
    return result;
  }

  public async getPOItemsById(poId: number): Promise<PurchaseOrderItem[]> {
    const knexResult = await this.queryBuilder("PurchaseOrderItem")
      .select(
        "id",
        "item",
        "count",
        "purchaseOrder",
      )
      .where("purchaseOrder", poId);
    return purchaseOrderItemsToDomain(knexResult);
  }

  public async getAllPOs(): Promise<PurchaseOrder[]> {
    const knexResult = await this.queryBuilder("PurchaseOrder")
      .select(
        "id",
        "creator",
        "createDate",
        "expectedDeliveryDate",
      );
    return purchaseOrdersToDomain(knexResult);
  }

  public async getPOById(poId: number): Promise<PurchaseOrder> {
    const knexResult = await this.queryBuilder("PurchaseOrder")
      .select(
        "id",
        "creator",
        "createDate",
        "expectedDeliveryDate",
      )
      .where("id", poId);
    return singlePurchaseOrderToDomain(knexResult);
  }

  public async createNewPO(creatorId: number, expectedDeliveryDate: Date, items: PurchaseOrderItemInput[], attachments: string[]): Promise<PurchaseOrder> {
    const newId = (await this.queryBuilder("PurchaseOrder")
      .insert({
        creator: creatorId,
        createDate: new Date().toISOString(),
        expectedDeliveryDate: expectedDeliveryDate,
      }, "id"))[0];

    if (items && items.length > 0) {
      this.addItemsToPO(newId, items);
    }

    if (attachments && attachments.length > 0) {
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

  public async removeAttachmentFromPO(attachment: string, poId: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderAttachment")
      .where({
        purchaseOrder: poId,
        attachment: attachment,
      }).del();
    return this.getPOById(poId);
  }

  public async removeItemFromPO(poId: number, itemId: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .where({
        purchaseOrder: poId,
        id: itemId,
      }).del();
    return this.getPOById(poId);
  }

  public async updateItemCountInPO(itemId: number | string, count: number, poId: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .where({
        purchaseOrder: poId,
        id: itemId,
      }).update({ count: count });
    return this.getPOById(poId);
  }

  public async deletePOById(poId: number): Promise<void> {
    await this.queryBuilder("PurchaseOrder")
      .where({
        id: poId,
      }).del();
  }

}