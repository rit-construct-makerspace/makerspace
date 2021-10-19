import { Option } from "./option";

export enum QuestionType {
    MULTIPLE_CHOICE,
    CHECKBOXES
}

export interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options: Option[];
}