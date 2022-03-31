export enum QuizItemType {
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
  Text = "TEXT",
  YoutubeEmbed = "YOUTUBE_EMBED",
  ImageEmbed = "IMAGE_EMBED",
}

export interface Option {
  id: string;
  text: string;
  correct: boolean;
}

export type QuizItem = {
  id: string;
  type: QuizItemType;
  text: string;
  options?: Option[];
};
