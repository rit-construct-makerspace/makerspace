import { PurchaseOrder } from "../../models/store/purchaseOrder";

export class PurchaseOrderMappper {
  public static toDomain(raw: any): PurchaseOrder[] {
    let arr: PurchaseOrder[] = [];
    if (raw) {
      raw.forEach((i: any) => {
        if (!arr.some((po) => po.id === i.id)) {
          arr.push({
            id: i.id,
            creator: i.creator,
            createDate: i.createDate,
            expectedDeliveryDate: i.expectedDeliveryDate,
            items: [],
            attachments: [],
          });
        }

        if (i.attachment !== null) {
          let index: number = arr.findIndex((x) => (x.id = i.id));
          arr[index].attachments.push(i.attachment);
        }

        if (i.itemId !== null) {
          let index: number = arr.findIndex((x) => (x.id = i.id));
          arr[index].items.push({
            id: i.itemId,
            count: i.count,
            item: {
              id: i.invItemId,
              image: i.image,
              name: i.name,
              unit: i.unit,
              pluralUnit: i.pluralUnit,
              count: i.count,
              pricePerUnit: i.pricePerUnit,
              labels: [],
            },
          });
        }

        if (i.label !== null) {
          let index: number = arr.findIndex((x) => (x.id = i.id));
          let itemIndex: number = arr[index].items.findIndex(
            (x) => (x.id = i.itemId)
          );
          arr[index].items[itemIndex].item.labels.push(i.label);
        }
      });
    }
    return arr;
  }
}
