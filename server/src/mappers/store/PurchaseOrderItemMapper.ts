import { PurchaseOrderItem } from "../../models/store/purchaseOrderItem";

export function purchaseOrderItemsToDomain(raw: any): PurchaseOrderItem[] {
    const result = raw.map((i: any) => {
      const value: PurchaseOrderItem = {
        id: i.id,
        item: i.item,
        count: i.count,
        purchaseOrder: i.purchaseOrder,
      };
      return value
    });
    return result;
}