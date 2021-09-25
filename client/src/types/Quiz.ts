export interface QuizItem {
  id: string;
}

export interface Option extends QuizItem {
  text: string;
  correct: boolean;
}

export enum QuestionType {
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
}

export interface Question extends QuizItem {
  questionType: QuestionType;
  title: string;
  options: Option[];
}

export interface YouTubeEmbed extends QuizItem {
  embedId: string;
}

export interface ImageEmbed extends QuizItem {
  href: string;
}

export interface Quiz {
  id: string;
  items: QuizItem[];
}
