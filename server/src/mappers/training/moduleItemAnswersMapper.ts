import { ModuleItemAnswers } from "../../schemas/trainingSchema";

export function answersToDomain(raw: any[]): ModuleItemAnswers[] | null {
  if (raw === undefined || raw === null) return null;

  let answers: ModuleItemAnswers[] = [];

  for (let answer of raw) {
    let existing = answers.find((x) => x.moduleItemID === answer.moduleItem);

    // if answer object for current moduleItem already exists append optionID, otherwise create it
    if (existing) {
      existing.correctOptionIDs.push(answer.id);
    } else {
      let value: ModuleItemAnswers = {
        moduleItemID: answer.moduleItem,
        correctOptionIDs: [answer.id],
      };
      answers.push(value)
    }
  }

  return answers;
}
