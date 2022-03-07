import { knex } from "../../db";
import { Question } from "../../schemas/trainingSchema";
import * as QuestionMap from "../../mappers/training/questionMapper";

export async function getQuestion(
  questionId: number | string
): Promise<Question | null> {
  const knexResult = await knex("Question")
    .select(
      "id",
      "module",
      "questionType",
      "text"
    )
    .where("id", questionId);
  return QuestionMap.singleQuestionToDomain(knexResult);
}

export async function getQuestionsByModule(
  moduleId: number | string
): Promise<Question[]> {
  const knexResult = await knex("Question")
    .select(
      "id",
      "module",
      "questionType",
      "text"
    )
    .where("module", moduleId);
  return QuestionMap.QuestionsToDomain(knexResult);
}

export async function addQuestion(
  moduleId: number | string,
  question: Question
): Promise<Question | null> {
  const insert = await knex("Question").insert(
    { module: moduleId, questionType: question.type, text: question.text },
    "id"
  );
  return getQuestion(insert[0]);
}

export async function updateQuestion(id: number, question: Question) {
  await knex("Question")
    .where({ id: id })
    .update({ questionType: question.type, text: question.text });
}

export async function deleteQuestion(id: number) {
  await knex("Question").where({ id: id }).del();
}
