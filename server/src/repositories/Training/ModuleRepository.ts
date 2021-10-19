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

  // public async updateModule(moduel: Module): Promise<Module> {
    
  // }

  public async addModule(module: Module): Promise<Module> {
    const insert = await knex("TrainingModule").insert(
      { name: module.name },
      "id"
    );
    return this.getModuleById(insert[0]);
  }
}
