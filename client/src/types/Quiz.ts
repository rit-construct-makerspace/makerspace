export enum QuizItemType {
  MultipleChoice = "MULTIPLE_CHOICE",
  Checkboxes = "CHECKBOXES",
  Text = "TEXT",
  YoutubeEmbed = "YOUTUBE_EMBED",
  ImageEmbed = "IMAGE_EMBED",
  ReservationPrompt = "RESERVATION PROMPT"
}

export interface Option {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizItem {
  id: string;
  type: QuizItemType;
  text: string;
  options?: Option[];
};

export interface ReservationPrompt {
  promptText?: string;
  enabled: boolean;
}

export interface Module {
  id: number;
  name: string;
  archived: boolean;
  quiz: QuizItem[];
  reservationPrompt: ReservationPrompt;
};

export interface Submission {
  id: number;
  moduleID: number;
  makerID: number;
  submissionDate: string;
  passed: boolean;
  expirationDate: string;
}
