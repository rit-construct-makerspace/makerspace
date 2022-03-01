import { Module } from "../../models/training/module";
import { ModuleMap } from "../../mappers/training/moduleMapper";
import * as QuestionRepo from "./questionRepo";
import { knex } from "../../db";
import { ModuleChanges } from "../../models/events/DomainEvents";
import { OptionRepo } from "./optionRepo";

export async function getModuleById(
  moduleId: number | string
): Promise<Module> {
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
    )
    .where("TrainingModule.id", moduleId);

  return ModuleMap.toDomain(knexResult)[0];
}

export async function getModules(): Promise<Module[]> {
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

export async function save(module: Module): Promise<void> {
  //make sure module id is good
  await knex.transaction(async (trx: any) => {
    let transOptionRepo = new OptionRepo(trx);
    for (let e of module.domainEvents) {
      switch (e.name) {
        case ModuleChanges.NAME_CHANGE:
          await trx("TrainingModule").where({ id: module.id }).update({
            name: e.param,
          });
          break;
        case ModuleChanges.NEW_QUESTION:
          await QuestionRepo.addQuestion(module.id!, e.param);
          break;
        case ModuleChanges.DELETE_QUESTION:
          await QuestionRepo.deleteQuestion(e.param.id);
          break;
        case ModuleChanges.NEW_OPTION:
          await transOptionRepo.addOptionToQuestion(
            e.param.question.id,
            e.param.option
          );
          break;
        case ModuleChanges.DELETE_OPTION:
          await transOptionRepo.deleteOptionById(e.param.option.id);
          break;
      }
    }
  });
}

export async function deleteModuleById(moduleId: number): Promise<void> {
  await knex("TrainingModule").where({ id: moduleId }).del();
}

export async function addModule(module: Module): Promise<Module> {
  const insert = await knex("TrainingModule").insert(
    { name: module.name },
    "id"
  );
  return getModuleById(insert[0]);
}
