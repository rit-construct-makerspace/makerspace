export enum ModuleItemType {
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
  Text = "TEXT",
  YouTube = "YOUTUBE",
  Image = "IMAGE",
}

export interface QuestionOption {
  id: number;
  text: string;
  correct: boolean;
}

export interface ModuleItem {
  id: number;
  type: ModuleItemType;
  text: string;
  options: QuestionOption[];
}

export interface Module {
  id: number;
  items: ModuleItem[];
}
