import { Module } from "../../models/training/module";

export class ModuleMap {
  public static toDomain(raw: any): Module[] {
    let arr: Module[] = [];
    let used_ques = new Set();
    raw.forEach((i: any) => {
      if (!arr.some((mod) => mod.id === i.id))
        arr.push(new Module(i.name, [], i.id));
      if (i.question_id !== null) {
        if (!used_ques.has(i.question_id)) {
          used_ques.add(i.question_id);
          let index: number = arr.findIndex((x) => x.id === i.id);
          arr[index].items.push({
            id: i.question_id,
            text: i.question_text,
            type: i.questionType,
            options: [],
          });
        }
      }
    });
    raw.forEach((i: any) => {
      if (i.option_id !== null) {
        arr.forEach((m) => {
          let index = m.items.findIndex((x) => x.id === i.question);
          if (index !== -1) {
            m.items[index].options.push({
              id: i.option_id,
              text: i.option_text,
              correct: i.correct,
            });
          }
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
