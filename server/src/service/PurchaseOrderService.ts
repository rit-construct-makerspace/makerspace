import { PurchaseOrder } from "../models/store/purchaseOrder";
import { PurchaseOrderItemInput } from "../models/store/purchaseOrderItemInput";
import { IPurchaseOrderRepo } from "../repositories/Store/poRepository";

export class PurchaseOrderService {
  poRepo: IPurchaseOrderRepo;

  constructor(repo: IPurchaseOrderRepo) {
    this.poRepo = repo;
  }

  public async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return await this.poRepo.getAllPOs();
  }

  public async getPurchaseOrder(Id: number): Promise<PurchaseOrder> {
    return await this.poRepo.getPOById(Id);
  }

  public async createNewPurchaseOrder(
    creatorId: number,
    expectedDeliveryDate: Date,
    items: PurchaseOrderItemInput[],
    attachments: string[]
  ): Promise<PurchaseOrder> {
    return await this.poRepo.createNewPO(creatorId, expectedDeliveryDate, items, attachments);
  }

  public async addItemsToPurchaseOrder(poId: number, items: PurchaseOrderItemInput[]) : Promise<PurchaseOrder> {
    return await this.poRepo.addItemsToPO(poId, items);
  }

  public async removeItemFromPurchaseOrder(poId: number, itemId: number): Promise<PurchaseOrder> {
      return await this.poRepo.removeItemFromPO(poId, itemId);
  }

  public async setItemCountInPurchaseOrder(poId: number, itemId: number, count: number): Promise<PurchaseOrder> {
      return await this.poRepo.updateItemCountInPO(itemId, count, poId);
  }

  public async addAttachments(poId: number, attachments: string[]) : Promise<PurchaseOrder> {
      return await this.poRepo.addAttachmentsToPO(attachments, poId);
  }

  public async removeAttachment(poId: number, attachment: string) : Promise<PurchaseOrder> {
      return await this.poRepo.removeAttachmentFromPO(attachment, poId);
  }

}
