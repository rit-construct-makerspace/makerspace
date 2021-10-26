import { Module } from "../../models/training/module";
import { ModuleMap } from "../../mappers/training/moduleMapper";
import { IQuestionRepo, QuestionRepo } from "./questionRepo"; //this is lame
import { knex } from "../../db";

export interface IModuleRepo {
  getModuleById(moduleId: number): Promise<Module>;
  getModules(): Promise<Module[]>;
  addModule(module: Module): Promise<Module>;
}

export class ModuleRepo implements IModuleRepo {
  private questionRepo: IQuestionRepo;

  constructor(questionRepo?: IQuestionRepo) {
    this.questionRepo = questionRepo || new QuestionRepo();
  }

  public async getModuleById(moduleId: number | string): Promise<Module> {
    const knexResult = await knex("TrainingModule")
      .leftJoin("Question", "TrainingModule.id", "=", "Question.id")
      .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.id")
      .select("TrainingModule.id", "TrainingModule.name")
      .where("TrainingModule.id", moduleId);
    return ModuleMap.toDomain(knexResult)[0];
  }

  public async getModules(): Promise<Module[]> {
    const knexResult = await knex("TrainingModule")
      .leftJoin("Question", "TrainingModule.id", "=", "Question.id")
      .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.id")
      .select(
        "TrainingModule.id",
        "TrainingModule.name",
        "Question.id as question_id",
        "Question.text",
        "Question.questionType"
      );
    return ModuleMap.toDomain(knexResult);
  }

  public async save(module: Module): Promise<void> {
    knex.transaction((trx: any) => {
      knex('books').transacting(trx).insert({name: 'Old Books'})
        .then(() => {

          for (let e of module.domainEvents) {
            switch (e.name) {
              case 'NAME_CHANGE':
              case 'NEW_QUESTION':
              case 'DELETE_QUESTION':
              case 'NEW_OPTION':
              case 'DELETE_OPTION':
            }
          }

        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(() => {
      console.log('Transaction complete.');
    })
    .catch((err: any) => {
      console.error(err);
    });
  }

  public async deleteModuleById(moduleId: number | string): Promise<void> {
    const knexResult = await knex("TrainingModule")
      .delete();
  }  

  public async addModule(module: Module): Promise<Module> {
    const insert = await knex("TrainingModule").insert(
      { name: module.name },
      "id"
    );
    return this.getModuleById(insert[0]);
  }
}
