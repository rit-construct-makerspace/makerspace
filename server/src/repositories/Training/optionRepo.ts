import { knex } from "../../db";
import { Question } from "../../models/training/question";
import { OptionMap } from "../../mappers/training/optionMapper";
import { Option } from "../../models/training/option";

export interface IOptionRepo {}

export class OptionRepo implements IOptionRepo {
  constructor() {}

  public async getOptionById(questionId: number | string): Promise<Option> {
    const knexResult = await knex("QuestionOption")
      .select("id", "question", "text", "correct")
      .where("Question.id", questionId);
    return OptionMap.toDomain(knexResult)[0];
  }

  public async getOptionsByQuestion(
    questionId: number | string
  ): Promise<Option[]> {
    const knexResult = await knex("QuestionOption")
      .select("id", "question", "text", "correct")
      .where("question", questionId);
    return OptionMap.toDomain(knexResult);
  }

  public async addOptionToQuestion(
    questionId: number | string,
    option: Option
  ): Promise<Option> {
    const insert = await knex("QuestionOption").insert(
      { text: option.text, correct: option.correct },
      "id"
    );
    return this.getOptionById(insert[0]);
  }
}
