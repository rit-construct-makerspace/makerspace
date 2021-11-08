import { Option } from "../../models/training/option";

export class OptionMap {
  public static toDomain(raw: any): Option[] {
    const options = raw.map((row: any) => {
        const result: Option = {
            id: row.id,
            text: row.id,
            correct: row.correct,
        }
        return result
    })
    return options
  }

  public static toPersistence(option: Option): any {
    return {
      id: option.id,      
      text: option.text,
      correct: option.correct, 
    };
  }

}