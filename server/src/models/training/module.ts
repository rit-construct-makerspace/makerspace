import { Question } from "./question";

export class Module {
  id: number;
  name: string;
  items: Question[];

  constructor(id: number, name: string, items: Question[]) {
    this.id = id;
    this.name = name;
    this.items = items;
  }
}

// export interface TrainingModuleItem {
//     id: number;
// }

// export interface Question extends TrainingModuleItem {
//     text: string;
//     type: QuestionType
//     options: QuestionOption[];
// }

// export interface QuestionOption {
//     id: number;
//     text: string;
//     correct: boolean;
// }

// export enum QuestionType {
//     MULTIPLE_CHOICE,
//     CHECKBOXES
// }
