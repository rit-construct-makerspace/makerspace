export enum QuizItemType {
  Question = "QUESTION",
  YoutubeEmbed = "YOUTUBE_EMBED",
  ImageEmbed = "IMAGE_EMBED",
}

export interface Option {
  id: string;
  text: string;
  correct: boolean;
}

export enum QuestionType {
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
}

export interface Question {
  quizItemType: QuizItemType.Question;
  id: string;
  questionType: QuestionType;
  title: string;
  options: Option[];
}

export interface YoutubeEmbed {
  quizItemType: QuizItemType.YoutubeEmbed;
  id: string;
  embedId: string;
}

export interface ImageEmbed {
  quizItemType: QuizItemType.ImageEmbed;
  id: string;
  href: string;
}

export type QuizItem = Question | YoutubeEmbed | ImageEmbed;

export interface Quiz {
  id: string;
  items: QuizItem[];
}
