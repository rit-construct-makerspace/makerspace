import { Question } from "../../schemas/trainingSchema";


export function QuestionsToDomain(raw: any): Question[] {
  return raw.map((i: any) => singleQuestionToDomain(i));
}

export function singleQuestionToDomain(raw: any): Question | null {
  if (raw === undefined || raw === null) return null;
  if (Array.isArray(raw)) {
    raw = raw[0]
  }
  const value: Question = {
    id: raw.id,
    type: raw.questionType,
    text: raw.text,
  }
  return value;
}
