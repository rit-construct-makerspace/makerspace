import { knex } from "../../db";
import { TrainingModule } from "../../schemas/trainingSchema";
import * as TrainingModuleMap from "../../mappers/training/TrainingModuleMapper"

export async function getModuleById(
  id: number | string
): Promise<TrainingModule | null> {
  const knexResult = await knex("TrainingModule")
    .select(
      "id",
      "name"
    )
    .where("id", id);

  return TrainingModuleMap.singleTrainingModuleToDomain(knexResult);
}

export async function getModules(): Promise<TrainingModule[]> {
  const knexResult = await knex("TrainingModule")
    .select(
      "id",
      "name"
    );
  return TrainingModuleMap.trainingModulesToDomain(knexResult);
}

export async function archiveModule(id: number): Promise<TrainingModule | null> {
  await knex("TrainingModule").where({ id: id}).update({archived: true})
  return getModuleById(id);
}

export async function addModule(name: string): Promise<TrainingModule | null> {
  const insert = await knex("TrainingModule").insert(
    { name: name },
    "id"
  );
  return getModuleById(insert[0]);
}

export async function updateName(id: number, name: string): Promise<TrainingModule | null> {
  await knex("TrainingModule").where({ id: module.id }).update({
    name: name,
  });
  return getModuleById(id);
}
