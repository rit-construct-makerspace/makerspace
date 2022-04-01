import { knex } from "../../db";
import { TrainingModule } from "../../schemas/trainingSchema";
import { EntityNotFound } from "../../EntityNotFound";
import { EquipmentRow, TrainingModuleRow } from "../../db/tables";
import { EquipmentInput } from "../../schemas/equipmentSchema";

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
    },
    "id"
  );

  if (equipment.moduleIDs?.length)
    await addModulesToEquipment(id, equipment.moduleIDs);

  return await getEquipmentByID(id);
}
