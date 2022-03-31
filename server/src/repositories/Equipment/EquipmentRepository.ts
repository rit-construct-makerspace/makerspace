import { knex } from "../../db";
import { EquipmentInput } from "../../models/equipment/equipmentInput";
import { TrainingModule } from "../../schemas/trainingSchema";
import { EntityNotFound } from "../../EntityNotFound";
import { EquipmentRow, TrainingModuleRow } from "../../db/tables";

export async function getEquipmentByID(id: number): Promise<EquipmentRow> {
  const equipment = await knex("Equipment").where({ id }).first();

  if (!equipment) throw new EntityNotFound("Could not find equipment #${id}");

  return equipment;
}

export async function archiveEquipment(id: number): Promise<EquipmentRow> {
  await knex("Equipment").where({ id: id }).update({ archived: true });
  return getEquipmentByID(id);
}

export async function getEquipments(): Promise<EquipmentRow[]> {
  return knex("Equipment").select();
}

export async function getEquipmentWithRoomID(
  roomID: number
): Promise<EquipmentRow[]> {
  return knex("Equipment").select().where({ roomID });
}

export async function getModulesByEquipment(
  equipmentID: number
): Promise<TrainingModuleRow[]> {
  return knex("ModulesForEquipment")
    .join("TrainingModule", "TrainingModule.id", "ModulesForEquipment.moduleID")
    .select("TrainingModule.*")
    .where("ModulesForEquipment.equipmentID", equipmentID);
}

export async function addModulesToEquipment(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment").insert(
    trainingModules.map((trainingModule) => ({
      equipmentID: id,
      moduleID: trainingModule,
    }))
  );
}

export async function removeModulesFromEquipment(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment")
    .where("equipmentID", id)
    .whereIn("moduleID", trainingModules)
    .del();
}

export async function updateModules(
  id: number,
  trainingModules: number[]
): Promise<void> {
  await knex("ModulesForEquipment").del().where("equipmentId", id);
  if (trainingModules && trainingModules.length > 0) {
    await addModulesToEquipment(id, trainingModules);
  }
}

export async function updateEquipment(
  id: number,
  equipment: EquipmentInput
): Promise<EquipmentRow> {
  await knex("Equipment")
    .where("id", id)
    .update({
      name: equipment.name,
      inUse: equipment.inUse,
      roomID: equipment.roomID,
    })
    .then(async () => {
      await updateModules(id, equipment.trainingModules);
    });

  return getEquipmentByID(id);
}

export async function addEquipment(
  equipment: EquipmentInput
): Promise<EquipmentRow> {
  const [id] = await knex("Equipment").insert(
    {
      name: equipment.name,
      inUse: equipment.inUse,
      roomID: equipment.roomID,
    },
    "id"
  );

  if (equipment.trainingModules?.length)
    await addModulesToEquipment(id, equipment.trainingModules);

  return await getEquipmentByID(id);
}
