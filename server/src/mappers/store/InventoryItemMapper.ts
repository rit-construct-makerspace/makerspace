import { InventoryItem } from "../../models/store/inventoryItem";

export function inventoryItemstoDomain(raw: any): InventoryItem[] {
  const result = raw.map((i: any) => {
    return singleInventoryItemtoDomain(i);
  })
  return result;
}

export function singleInventoryItemtoDomain(raw: any): InventoryItem | null {
  if (raw === undefined || raw === null) return null;
  const value: InventoryItem = {
    id: raw.id,
    image: raw.image,
    name: raw.name,
    unit: raw.unit,
    pluralUnit: raw.pluralUnit,
    count: raw.count,
    pricePerUnit: raw.pricePerUnit
  }
  return value;
}

