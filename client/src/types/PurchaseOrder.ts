import InventoryItem from "./InventoryItem";
import Person from "./Person";

export interface PurchaseOrderItem {
  id: number;
  item: InventoryItem;
  count: number;
}

export default interface PurchaseOrder {
  id: number;
  creator: Person;
  createDate: Date;
  expectedDeliveryDate: Date;
  items: PurchaseOrderItem[];
  attachments: string[];
}
