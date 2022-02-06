import { InventoryItem } from "../../models/store/inventoryItem";

export function toDomain(raw: any): InventoryItem[] {
  let arr: InventoryItem[] = [];

  raw.forEach((i: any) => {
    if (!arr.some((item) => item.id === i.id))
      arr.push({
        id: i.id,
        image: i.image,
        name: i.name,
        unit: i.unit,
        pluralUnit: i.pluralUnit,
        count: i.count,
        pricePerUnit: i.pricePerUnit,
        labels: []
      });

    if (i.label !== null) {
      let index: number = arr.findIndex((x) => (x.id = i.id));
      arr[index].labels.push(i.label);
    }

  });
  return arr;
}

