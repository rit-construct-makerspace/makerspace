import { knex } from "../../db";
import { Equipment } from "../../models/equipment/equipment";
import { EquipmentInput } from "../../models/equipment/equipmentInput";
import {
  equipmentToDomain,
  singleEquipmentToDomain,
} from "../../mappers/equipment/Equipment";
import { TrainingModule } from "../../models/training/trainingModule";
import { singleTrainingModuleToDomain } from "../../mappers/training/TrainingModuleMapper";

export async function getEquipmentById(
  id: string | number
): Promise<Equipment | null> {
  const knexResult = await knex
    .first("id", "name", "addedAt", "inUse", "roomID")
    .from("Equipment")
    .where("id", id);

  return singleEquipmentToDomain(knexResult);
}

export async function removeEquipment(id: number): Promise<void> {
  await knex("ModulesForEquipment").where({ equipmentId: id }).del();
  await knex("Equipment").where({ id: id }).del();
}

export async function getEquipments(): Promise<Equipment[]> {
  const knexResult = await knex("Equipment").select();
  return equipmentToDomain(knexResult);
}

export async function getEquipmentWithRoomID(
  roomID: number
): Promise<Equipment[]> {
  const result = await knex("Equipment").select().where({ roomID });
  return equipmentToDomain(result);
}

export async function getTrainingModules(
  id: number
): Promise<TrainingModule[] | null> {
  const knexResult = await knex("ModulesForEquipment")
    .leftJoin(
      "TrainingModule",
      "TrainingModule.id",
      "=",
      "ModulesForEquipment.trainingModuleId"
    )
    .select("TrainingModule.id", "TrainingModule.name")
    .where("ModulesForEquipment.equipmentId", id);
  const result = knexResult.map((i: any) => singleTrainingModuleToDomain(i));
  if (result.length === 1 && result[0] === null) return null;
  return result;
}

export async function addTrainingModulesToEquipment(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment").insert(
    trainingModules.map((trainingModule) => ({
      equipmentId: id,
      trainingModuleId: trainingModule,
    }))
  );
}

export async function removeTrainingModulesFromEquipment(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment")
    .where("equipmentId", "=", id)
    .whereIn("trainingModuleId", trainingModules)
    .del();
}

export async function updateTrainingModules(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment").del().where("equipmentId", id);
  if (trainingModules && trainingModules.length > 0) {
    await addTrainingModulesToEquipment(id, trainingModules);
  }
}

export async function updateEquipment(
  id: number,
  equipment: EquipmentInput
): Promise<Equipment | null> {
  await knex("Equipment")
    .where("id", id)
    .update({
      name: equipment.name,
      inUse: equipment.inUse,
      roomID: equipment.roomID,
    })
    .then(async () => {
      await updateTrainingModules(id, equipment.trainingModules);
    });

  return getEquipmentById(id);
}

export async function addEquipment(
  equipment: EquipmentInput
): Promise<Equipment | null> {
  const newId = (
    await knex("Equipment").insert(
      {
        name: equipment.name,
        inUse: equipment.inUse,
        roomID: equipment.roomID,
      },
      "id"
    )
  )[0];
  if (equipment.trainingModules && equipment.trainingModules.length > 0)
    await addTrainingModulesToEquipment(newId, equipment.trainingModules);

  return await getEquipmentById(newId);
}
