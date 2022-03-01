import { knex } from "../../db";
import { Question } from "../../models/training/question";
import { QuestionMap } from "../../mappers/training/questionMapper";

export async function getQuestion(
  questionId: number | string
): Promise<Question> {
  const knexResult = await knex("Question")
    .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.id")
    .select(
      "Question.id",
      "Question.module",
      "Question.questionType",
      "Question.text"
    )
    .where("Question.id", questionId);
  return QuestionMap.toDomain(knexResult)[0];
}

export async function getQuestionsByModule(
  moduleId: number | string
): Promise<Question[]> {
  const knexResult = await knex("Question")
    .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.id")
    .select(
      "Question.id",
      "Question.module",
      "Question.questionType",
      "Question.text"
    )
    .where("Question.module", moduleId);
  return QuestionMap.toDomain(knexResult);
}

export async function addQuestion(
  moduleId: number | string,
  question: Question
): Promise<Question> {
  const insert = await knex("Question").insert(
    { module: moduleId, questionType: question.type, text: question.text },
    "id"
  );
  return getQuestion(insert[0]);
}

export async function updateQuestion(questionId: number, question: Question) {
  await knex("Question")
    .where({ id: questionId })
    .update({ questionType: question.type, text: question.text });
}

export async function deleteQuestion(questionId: number) {
  await knex("Question").where({ id: questionId }).del();
}
