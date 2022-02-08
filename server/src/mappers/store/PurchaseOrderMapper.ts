import { PurchaseOrder } from "../../models/store/purchaseOrder";

export function purchaseOrdersToDomain(raw: any): PurchaseOrder[] {
  const result = raw.map((i: any) => {
    return singlePurchaseOrderToDomain(i)
  });
  return result;
}

export function singlePurchaseOrderToDomain(raw: any): PurchaseOrder {
  if (Array.isArray(raw))
    raw = raw[0]
  const value: PurchaseOrder = {
    id: raw.id,
    creatorId: raw.creator,
    createDate: raw.createDate,
    expectedDeliveryDate: raw.expectedDeliveryDate,
  };
  return value;
}

