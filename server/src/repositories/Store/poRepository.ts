import knex from "knex";
import { PurchaseOrderMappper } from "../../mappers/store/PurchaseOrderMapper";
import { InventoryItem } from "../../models/store/inventoryItem";
import { PurchaseOrder } from "../../models/store/purchaseOrder";

export interface IPORepo {
  getPOById(poId: number | string): Promise<PurchaseOrder>;
  addItemToPO(item: InventoryItem, poId: number | string, count: number): Promise<PurchaseOrder>;
  addAttachmentToPO(attachment: string, poId: number | string): Promise<PurchaseOrder>;
  removeAttachmentFromPO(attachment: string, poId: number | string): Promise<PurchaseOrder>;
  removeItemFromPO(itemId: number | string, poId: number | string): Promise<PurchaseOrder>;
  updateItemCountInPO(itemId: number | string, count: number, poId: number | string): Promise<PurchaseOrder>;
  deletePOById(poId: number | string): Promise<void>;
}


export class PORepo implements IPORepo {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
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
        "PurchaseOrder.text",
        "PurchaseOrderItem.id",
        "PurchaseOrderItem.item",
        "PurchaseOrderItem.count",
        "PurchaseOrderAttachment.id",
        "PurchaseOrderAttachment.attachment"
      )
      .where("PurchaseOrder.id", poId);
    return PurchaseOrderMappper.toDomain(knexResult)[0];
  }

  public async addItemToPO(item: InventoryItem, poId: number | string, count: number): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderItem")
      .insert({
        item: item.id,
        purchaseOrder: poId,
        count: item.unit,
      });
    return this.getPOById(poId);
  }

  public async addAttachmentToPO(attachment: string, poId: number | string): Promise<PurchaseOrder> {
    await this.queryBuilder("PurchaseOrderAttachment")
      .insert({
        purchaseOrder: poId,
        attachment: attachment,
      });
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