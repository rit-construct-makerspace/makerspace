import { Question } from "./question";

export interface Module {
  id: number;
  name: string;
  items: Question[];
}
