import { InventoryItem } from "./inventoryItem";

export interface PurchaseOrderItem {
    id: number;
    item: InventoryItem;
    count: number;
  }