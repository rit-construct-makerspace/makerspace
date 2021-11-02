import { knex } from "../../db";
import { OptionMap } from "../../mappers/training/optionMapper";
import { Option } from "../../models/training/option";

export interface IOptionRepo {
  getOptionById(questionId: number | string): Promise<Option>;
  getOptionsByQuestion(questionId: number | string): Promise<Option[]>;
  addOptionToQuestion(
    questionId: number | string,
    option: Option
  ): Promise<Option>;
  deleteOptionById(optionId: number): Promise<void>;
}

export class OptionRepo implements IOptionRepo {
  private queryBuilder;

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex;
  }

  public async getOptionById(questionId: number | string): Promise<Option> {
    const knexResult = await this.queryBuilder("QuestionOption")
      .select("id", "question", "text", "correct")
      .where("id", questionId);
    return OptionMap.toDomain(knexResult)[0];
  }

  public async getOptionsByQuestion(
    questionId: number | string
  ): Promise<Option[]> {
    const knexResult = await this.queryBuilder("QuestionOption")
      .select("id", "question", "text", "correct")
      .where("question", questionId);
    return OptionMap.toDomain(knexResult);
  }

  public async addOptionToQuestion(
    questionId: number | string,
    option: Option
  ): Promise<Option> {
    const insert = await this.queryBuilder("QuestionOption").insert(
      { question: questionId, text: option.text, correct: option.correct },
      "id"
    );
    return this.getOptionById(insert[0]);
  }

  public async updateOption(option: Option): Promise<void> {
    const update = await this.queryBuilder("QuestionOption")
      .where({ id: option.id })
      .update({
        correct: option.correct,
        text: option.text,
      });
    return update;
  }

  public async deleteOptionById(optionId: number): Promise<void> {
    await this.queryBuilder("QuestionOption").where({ id: optionId }).del();
  }

}
