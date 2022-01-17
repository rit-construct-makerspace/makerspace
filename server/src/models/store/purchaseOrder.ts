import { Person } from "./person";
import { PurchaseOrderItem } from "./purchaseOrderItem";

export interface PurchaseOrder {
    id: number;
    creator: Person;
    createDate: Date;
    expectedDeliveryDate: Date;
    items: PurchaseOrderItem[];
    attachments: string[];
  }