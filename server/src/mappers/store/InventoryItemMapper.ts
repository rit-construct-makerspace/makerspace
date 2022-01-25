import { InventoryItem } from "../../models/store/inventoryItem";

export class InventoryItemMappper {
  public static toDomain(raw: any): InventoryItem[] {
    let arr: InventoryItem[] = [];
    raw.forEach((i: any) => {
      if (!arr.some((question) => question.id === i.id))
        arr.push({ id: i.id, text: i.text, type: i.type, options: [] });
      if (i.option_id !== null) {
        let index: number = arr.findIndex((x) => (x.id = i.id));
        arr[index].options.push({
          id: i.option_id,
          text: i.text,
          correct: i.correct,
        });
      }
    });
    return arr; // a bit awkward that this returns an array vs single object
  }
}
