import { knex } from "../../db";
import { TrainingModuleRow } from "../../db/tables";
import { EntityNotFound } from "../../EntityNotFound";
import { PassedModule } from "../../schemas/usersSchema";

export async function getModules(): Promise<TrainingModuleRow[]> {
  return knex("TrainingModule").select();
}

export async function getModulesWhereArchived(archived: boolean): Promise<TrainingModuleRow[]> {
  return knex("TrainingModule")
          .select()
          .where({ archived: archived });
}

export async function getModuleByID(id: number): Promise<TrainingModuleRow> {
  const trainingModule = await knex("TrainingModule").first().where({ id });

  if (!trainingModule)
    throw new EntityNotFound(`Training module #${id} not found`);

  return trainingModule;
}

export async function getModuleByIDWhereArchived(id: number, archived: boolean): Promise<TrainingModuleRow> {
  const trainingModule = await knex("TrainingModule")
                                .first()
                                .where({
                                  id: id,
                                  archived: archived
                                });

  if (!trainingModule)
    throw new EntityNotFound(`Training module #${id} not found`);

  return trainingModule;
}

export async function setModuleArchived(id: number, archived: boolean): Promise<TrainingModuleRow> {
  const updatedModules: TrainingModuleRow[] = await knex("TrainingModule")
                                                      .where({ id: id })
                                                      .update({ archived: archived });

  // TODO: Detatch equipment that require this module?
  // await knex("ModulesForEquipment").delete().where({moduleID: id});

  if (updatedModules.length < 1) throw new EntityNotFound(`Training module #${id} not found`);

  return updatedModules[0];
}

export async function addModule(name: string): Promise<TrainingModuleRow> {
  const addedModule: TrainingModuleRow[] = await knex("TrainingModule")
                      .insert(
                        {
                          name: name,
                          archived: true 
                        }, "*");

  if (addedModule.length < 1) throw new EntityNotFound(`Could not add module ${name}`);

  return addedModule[0];
}

export async function updateModule(
  id: number,
  name: string,
  quiz: object,
  reservationPrompt: object
): Promise<TrainingModuleRow> {
  await knex("TrainingModule")
    .where({ id })
    // @ts-ignore
    .update({ name, quiz: JSON.stringify(quiz), reservationPrompt: JSON.stringify(reservationPrompt) });
  return getModuleByID(id);
}

export async function getPassedModulesByUser(
  userID: number
): Promise<PassedModule[]> {
  return knex("ModuleSubmissions")
    .join("TrainingModule", "TrainingModule.id", "ModuleSubmissions.moduleID")
    .select(
      "ModuleSubmissions.id",
      "ModuleSubmissions.moduleID",
      "TrainingModule.name as moduleName",
      "ModuleSubmissions.submissionDate",
      "ModuleSubmissions.expirationDate"
    )
    .where("ModuleSubmissions.makerID", userID)
    .andWhere("ModuleSubmissions.passed", true);
}

export async function hasPassedModule(
  userID: number,
  moduleID: number
) : Promise<boolean> {
  return (await getPassedModulesByUser(userID)).some((passedModule: PassedModule) => {
    // User has this training if they have a passing and non-expired submission
    return passedModule?.moduleID === moduleID && passedModule?.expirationDate > new Date();
  });
}
