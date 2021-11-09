import { knex } from "../../db";
import { Question } from "../../models/training/question";
import { QuestionMap } from "../../mappers/training/questionMapper";
import { query } from "express";

export interface IQuestionRepo {
  getQuestionById(questionId: number | string): Promise<Question>;
  getQuestionsByModule(moduleId: number | string): Promise<Question[]>;
  addQuestionToModule(
    moduleId: number | string,
    question: Question
  ): Promise<Question>;
  deleteQuestionById(questionId: number | string): Promise<void>
}

export class QuestionRepo implements IQuestionRepo {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
  }

  public async getQuestionById(questionId: number | string): Promise<Question> {
    const knexResult = await this.queryBuilder("Question")
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
    const knexResult = await this.queryBuilder("Question")
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
    const insert = await this.queryBuilder("Question").insert(
      { module: moduleId, questionType: question.type, text: question.text },
      "id"
    );
    return this.getQuestionById(insert[0]);
  }

  public async deleteQuestionById(questionId: number) {
    await this.queryBuilder("Question").where({ id: questionId }).del();
  }

}
