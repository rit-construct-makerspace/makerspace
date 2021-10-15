import { Module } from "../../models/training/module";

export class ModuleMap {
  public static toDomain(raw: any): Module[] {
    let arr: Module[] = [];
    raw.forEach((i: any) => {
      if (!arr.some((mod) => mod.id === i.id))
        arr.push({ id: i.id, name: i.name, items: [] });
      if (i.question_id !== null) {
        let index: number = arr.findIndex((x) => (x.id = i.id));
        arr[index].items.push({
          id: i.question_id,
          text: i.text,
          type: i.questionType,
          options: [],
        });
      }
    });
    return arr; // a bit awkward that this returns an array vs single object
  }

  public static toPersistence(module: Module): any {
    return {
      id: module.id,
      name: module.name,
      items: module.items, // convert me too plz
    };
  }
}
