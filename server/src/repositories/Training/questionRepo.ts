import { knex } from "../../db";
import { Question } from "../../models/training/question";
import { QuestionMap } from "../../mappers/training/questionMapper";
import { query } from "express";

export interface IQuestionRepo {}

export class QuestionRepo implements IQuestionRepo {
  constructor() {}

  public async getQuestionById(questionId: number | string): Promise<Question> {
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

  public async getQuestionsByModule(
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

  public async addQuestionToModule(
    moduleId: number | string,
    question: Question
  ): Promise<Question> {
    const insert = await knex("TrainingModule").insert(
      { module: moduleId, type: question.type, text: question.text },
      "id"
    );
    return this.getQuestionById(insert[0]);
  }
}
