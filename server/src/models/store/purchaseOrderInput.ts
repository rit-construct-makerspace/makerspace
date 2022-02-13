import { PurchaseOrderItemInput } from "./purchaseOrderItemInput";

export interface PurchaseOrderInput {
    creatorID: number;
    createDate: Date;
    expectedDeliveryDate: Date;
    items: PurchaseOrderItemInput[];
    attachments: string[];
  }