export enum QuestionType {
    MULTIPLE_CHOICE,
    CHECKBOXES
}

export class Question {
    id: number;
    text: string;
    type: QuestionType;
    options: [];    //fix type plz
  
    constructor(id: number, text: string, type: QuestionType, options: []) {
      this.id = id;
      this.text = text;
      this.type = type;
      this.options = options;
    }
  }