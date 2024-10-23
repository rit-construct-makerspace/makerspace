import { knex } from "../../db/index.js";
import { EquipmentInstancesRow } from "../../db/tables.js";

export async function getInstancesByEquipment(equipmentID: number): Promise<EquipmentInstancesRow[]> {
    return await knex("EquipmentInstances").select().where({equipmentID});
}

export async function getInstanceByID(id: number): Promise<EquipmentInstancesRow | undefined> {
    return await knex("EquipmentInstances").select().where({id}).first();
}

export async function createInstance(equipmentID: number, name: string): Promise<EquipmentInstancesRow> {
    return await knex("EquipmentInstances").insert({equipmentID, name});
}

export async function setInstanceStatus(id: number, status: string): Promise<EquipmentInstancesRow> {
    return (await knex("EquipmentInstances").update({status}).where({id}).returning("*"))[0];
}

export async function setInstanceName(id: number, name: string): Promise<EquipmentInstancesRow> {
    return (await knex("EquipmentInstances").update({name}).where({id}).returning("*"))[0];
}

export async function deleteInstance(id: number): Promise<boolean> {
    await knex("EquipmentInstances").delete().where({id});
    return true;
}