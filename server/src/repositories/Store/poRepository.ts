import { InventoryItem } from "../../models/store/inventoryItem";
import { PurchaseOrder } from "../../models/store/purchaseOrder";

export interface IPORepo {
    getPOById(poId: number | string): Promise<PurchaseOrder>;
    addItemToPO(item: InventoryItem, poId: number | string): Promise<PurchaseOrder>;
    addAttachmentToPO(attachment: string, poId: number | string): Promise<PurchaseOrder>
    removeAttachmentFromPO(attachment: string, poId: number | string): Promise<PurchaseOrder>
    removeItemFromPO(itemId: number | string, poId: number | string): Promise<PurchaseOrder>;
    updateItemCountInPO(itemId: number | string, count: number, poId: number | string): Promise<PurchaseOrder>
    deletePOById(poId: number | string): Promise<void>;
  }