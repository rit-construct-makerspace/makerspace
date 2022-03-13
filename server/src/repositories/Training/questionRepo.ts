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
      "text",
      "order"
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
      "text",
      "order"
    )
    .where("module", moduleId);
  return QuestionMap.QuestionsToDomain(knexResult);
}

export async function addQuestion(
  moduleId: number,
  question: Omit<Question, "id" | "order">
): Promise<Question | null> {

  const newOrder = await getNextIndex(moduleId)

  const insert = await knex("Question").insert(
    { module: moduleId, questionType: question.type, text: question.text, order: newOrder },
    "id"
  );

  return getQuestion(insert[0]);
}

export async function updateQuestionOrder(moduleId: number, questionId: number, newOrder: number) {
  let question = await getQuestion(questionId)
  if (question === undefined || question === null)
    throw new Error("Provided questionId does not match existing question")
  let currentOrder = question.order
  updateOrderForOtherQuestions(moduleId, questionId, currentOrder, newOrder);
  await knex("Question")
    .where({ id: questionId })
    .update({ order: newOrder });
}

async function updateOrderForOtherQuestions(moduleId: number, questionId: number, currentOrder: number, newOrder: number) {
  if (newOrder > currentOrder)
    await knex("Question")
      .where('module', moduleId).andWhere('order', '>=', currentOrder).andWhere('order', '<=', newOrder)
      .update({ order: knex.raw('?? - 1', ['order']) });
  else
    await knex("Question")
      .where('module', moduleId).andWhere('order', '<=', currentOrder).andWhere('order', '>=', newOrder)
      .update({ order: knex.raw('?? + 1', ['order']) });
}

export async function updateQuestion(id: number, question: Question) {
  const current = await getQuestion(id)
  await knex("Question")
    .where({ id: id })
    .update({ questionType: question.type, text: question.text });
  if (current?.order !== question.order && current?.moduleId != null)
    await updateQuestionOrder(current?.moduleId, id, question.order)
}

async function getNextIndex(id: number) {
  const result = await knex('Question')
    .count('id')
    .groupBy('module')
    .having('module', '=', id);
  if (result[0] === undefined)
    return 0
  return result[0].count
}

export async function deleteQuestion(id: number) {
  await knex("Question").where({ id: id }).del();
}
