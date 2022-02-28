import { Module } from "../../models/training/module";
import { ModuleMap } from "../../mappers/training/moduleMapper";
import { IQuestionRepo, QuestionRepo } from "./questionRepo"; //this is lame
import { knex } from "../../db";
import { ModuleChanges } from "../../models/events/DomainEvents";
import { IOptionRepo, OptionRepo } from "./optionRepo";

export interface IModuleRepo {
  getModuleById(moduleId: number): Promise<Module>;
  getModules(): Promise<Module[]>;
  addModule(module: Module): Promise<Module>;
}

export class ModuleRepo implements IModuleRepo {
  private questionRepo: IQuestionRepo;
  private optionRepo: IOptionRepo;

  constructor(questionRepo?: IQuestionRepo, optionRepo?: IOptionRepo) {
    this.questionRepo = questionRepo || new QuestionRepo();
    this.optionRepo = optionRepo || new OptionRepo(); //this is not depedency injection :(
  }

  public async getModuleById(moduleId: number | string): Promise<Module> {
    const knexResult = await knex("TrainingModule")
      .leftJoin("Question", "TrainingModule.id", "=", "Question.module")
      .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.question")
      .select("TrainingModule.id", "TrainingModule.name")
      .where("TrainingModule.id", moduleId);

    return ModuleMap.toDomain(knexResult)[0];
  }

  public async getModules(): Promise<Module[]> {
    const knexResult = await knex("TrainingModule")
      .leftJoin("Question", "TrainingModule.id", "=", "Question.module")
      .leftJoin("QuestionOption", "Question.id", "=", "QuestionOption.question")
      .select(
        "TrainingModule.id",
        "TrainingModule.name",
        "Question.id as question_id",
        "Question.text as question_text",
        "Question.questionType",
        "QuestionOption.id as option_id",
        "QuestionOption.text as option_text",
        "QuestionOption.correct",
        "QuestionOption.question"
      );
    return ModuleMap.toDomain(knexResult);
  }

  public async save(module: Module): Promise<void> {
    //make sure module id is good
    //also switch statments are gross
    knex.transaction(async (trx: any) => {
      let transQuestionRepo = new QuestionRepo(trx);
      let transOptionRepo = new OptionRepo(trx);
      for (let e of module.domainEvents) {
        switch (e.name) {
          case ModuleChanges.NAME_CHANGE:
            await trx("TrainingModule").where({ id: module.id }).update({
              name: e.param,
            });
            break;
          case ModuleChanges.NEW_QUESTION:
            transQuestionRepo.addQuestionToModule(module.id!, e.param);
            break;
          case ModuleChanges.DELETE_QUESTION:
            transQuestionRepo.deleteQuestionById(e.param.id);
            break;
          case ModuleChanges.NEW_OPTION:
            transOptionRepo.addOptionToQuestion(
              e.param.question.id,
              e.param.option
            );
            break;
          case ModuleChanges.DELETE_OPTION:
            transOptionRepo.deleteOptionById(e.param.option.id);
            break;
        }
      }
    });
  }

  public async deleteModuleById(moduleId: number): Promise<void> {
    await knex("TrainingModule").where({ id: moduleId }).del();
  }

  public async addModule(module: Module): Promise<Module> {
    const insert = await knex("TrainingModule").insert(
      { name: module.name },
      "id"
    );
    return this.getModuleById(insert[0]);
  }
}
