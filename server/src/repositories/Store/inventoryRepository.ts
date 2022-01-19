import { knex } from "../../db";
import { InventoryItem } from "../../models/store/inventoryItem";


export interface IInventoryRepo {
  getItemById(itemId: number | string): Promise<InventoryItem>;
  updateItemById(item: InventoryItem): Promise<InventoryItem>;
  addItem(item: InventoryItem): Promise<InventoryItem>;
  deleteItemById(questitemIdionId: number | string): Promise<void>
}

export class InventoryRepo implements IInventoryRepo {

  private queryBuilder

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex
  }

  public async getItemById(itemId: number | string): Promise<InventoryItem>
  {
    // const knexResult = await this.queryBuilder("Question")
    //   .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.id")
    //   .select(
    //     "Question.id",
    //     "Question.module",
    //     "Question.questionType",
    //     "Question.text"
    //   )
    //   .where("Question.id", questionId);
    // return QuestionMap.toDomain(knexResult)[0];
  }

  public async updateItemById(item: InventoryItem): Promise<InventoryItem>
  {

  }

  public async addItem(item: InventoryItem): Promise<InventoryItem>
  {

  }

  public async deleteItemById(questitemIdionId: number | string): Promise<void>
  {

  }

}