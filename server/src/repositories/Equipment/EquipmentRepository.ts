import { knex } from "../../db";
import { EntityNotFound } from "../../EntityNotFound";
import { EquipmentRow, TrainingModuleRow, UserRow } from "../../db/tables";
import { EquipmentInput } from "../../schemas/equipmentSchema";
import * as ModuleRepo from "../Training/ModuleRepository";
import * as HoldsRepo from "../Holds/HoldsRepository";
import * as UserRepo from "../Users/UserRepository";

export async function getEquipment(): Promise<EquipmentRow[]> {
  return knex("Equipment")
          .select();
}

export async function getEquipmentWhereArchived(archived: boolean): Promise<EquipmentRow[]> {
  return knex("Equipment")
          .select()
          .where({archived: archived});
}

export async function getEquipmentByID(id: number): Promise<EquipmentRow> {
  const equipment = await knex("Equipment")
                            .where({
                              id: id
                            })
                            .first();

  if (!equipment) throw new EntityNotFound(`Could not find equipment #${id}`);

  return equipment;
}

export async function getEquipmentByIDWhereArchived(id: number, archived: boolean): Promise<EquipmentRow> {
  const equipment = await knex("Equipment")
                            .where({
                              id: id,
                              archived: archived
                            })
                            .first();

  if (!equipment) throw new EntityNotFound(`Could not find equipment #${id}`);

  return equipment;
}

export async function setEquipmentArchived(equipmentID: number, archived: boolean): Promise<EquipmentRow> {
  const updatedEquipment = await knex("Equipment")
                                  .where({ id: equipmentID })
                                  .update({ archived: archived })
                                  .returning("*");

  if (updatedEquipment.length < 1) throw new EntityNotFound(`Could not find equipment #${equipmentID}`);

  return updatedEquipment[0];
}

export async function publishEquipment(
  equipmentID: number
): Promise<EquipmentRow> {
  const updatedEquipment = await knex("Equipment")
                                  .where({ id: equipmentID })
                                  .update({ archived: false })
                                  .returning("*");

  if (updatedEquipment.length < 1) throw new EntityNotFound(`Could not find equipment #${equipmentID}`);

  return updatedEquipment[0];
}

export async function getEquipmentWithRoomID(
  roomID: number,
  archived: boolean
): Promise<EquipmentRow[]> {
  return knex("Equipment")
          .select()
          .where({
            roomID: roomID,
            archived: archived
          });
}

export async function getModulesByEquipment(
  equipmentID: number
): Promise<TrainingModuleRow[]> {
  return await knex("ModulesForEquipment")
  .join("TrainingModule", "TrainingModule.id", "ModulesForEquipment.moduleID")
  .select("TrainingModule.*")
  .where("ModulesForEquipment.equipmentID", equipmentID);
}

export async function hasTrainingModules(
  user: UserRow,
  equipmentID: number
): Promise<boolean> {
  let modules = await getModulesByEquipment(equipmentID);
  let hasTraining = true;
  // get last submission from maker for every module
  for(let i = 0; i < modules.length; i++) {
    if (await ModuleRepo.hasPassedModule(user.id, modules[i].id)) {
      continue;
    }
    else {
      hasTraining = false;
      break;
    }
  }
  return hasTraining;
}

export async function hasAccess(
  uid: string,
  equipmentID: number
): Promise<boolean> {
  const user = await UserRepo.getUserByUniversityID(uid);   // Get user for this university ID
  return user !== undefined &&                              // Ensure user exists
    !(await HoldsRepo.hasActiveHolds(user.id)) &&           // Ensure user has no holds
    await hasTrainingModules(user, equipmentID);            // Ensure user has completed necessary training
}

export async function getEquipmentForModule(
  moduleID: number
): Promise<EquipmentRow[]> {
  return knex("ModulesForEquipment")
    .join("Equipment", "Equipment.id", "ModulesForEquipment.equipmentID")
    .select("Equipment.*")
    .where("ModulesForEquipment.moduleID", moduleID);
}

export async function addModulesToEquipment(
  id: number,
  moduleIDs: number[]
): Promise<void> {
  await knex("ModulesForEquipment").insert(
    moduleIDs.map((trainingModule) => ({
      equipmentID: id,
      moduleID: trainingModule,
    }))
  );
}

export async function updateModules(
  id: number,
  moduleIDs: number[]
): Promise<void> {
  await knex("ModulesForEquipment").del().where("equipmentID", id);
  if (moduleIDs && moduleIDs.length > 0) {
    await addModulesToEquipment(id, moduleIDs);
  }
}

export async function updateEquipment(
  id: number,
  equipment: EquipmentInput
): Promise<EquipmentRow> {
  await knex("Equipment").where("id", id).update({
    name: equipment.name,
    roomID: equipment.roomID,
  });

  await updateModules(id, equipment.moduleIDs);

  return getEquipmentByID(id);
}

export async function addEquipment(
  equipment: EquipmentInput
): Promise<EquipmentRow> {
  const [id] = await knex("Equipment").insert(
    {
      name: equipment.name,
      roomID: equipment.roomID,
      archived: true
    },
    "id"
  );

  if (equipment.moduleIDs?.length)
    await addModulesToEquipment(id, equipment.moduleIDs);

  return await getEquipmentByID(id);
}