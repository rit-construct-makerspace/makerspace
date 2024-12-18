/**
 * EquipmentInstancesRepository.ts
 * DB Operations for Equipment Instances
 */

import { knex } from "../../db/index.js";
import { EquipmentInstancesRow } from "../../db/tables.js";

/**
 * Fetch all EquipmentInstances related to noted Equipment
 * @param equipmentID ID of equipment to filter by
 * @returns all Instances for noted Equipment
 */
export async function getInstancesByEquipment(equipmentID: number): Promise<EquipmentInstancesRow[]> {
    return await knex("EquipmentInstances").select().where({equipmentID}).orderBy("name", "asc");
}

/**
 * Fetch an EquipmentInstance by unqiue ID
 * @param id unique id of EquipmentInstance
 * @returns EquipmentInstance or undefined if not exist
 */
export async function getInstanceByID(id: number): Promise<EquipmentInstancesRow | undefined> {
    return await knex("EquipmentInstances").select().where({id}).first();
}

/**
 * Insert a new EquipmentInstance into table
 * @param equipmentID equipment ID of instance
 * @param name name of instance
 * @returns new EquipmentInstance
 */
export async function createInstance(equipmentID: number, name: string): Promise<EquipmentInstancesRow> {
    return await knex("EquipmentInstances").insert({equipmentID, name});
}

/**
 * Modify the status column of an EquipmentInstance
 * @param id ID of EquipmentInstance to modify
 * @param status new status to set
 * @returns updated EquipmentInstance
 */
export async function setInstanceStatus(id: number, status: string): Promise<EquipmentInstancesRow> {
    return (await knex("EquipmentInstances").update({status}).where({id}).returning("*"))[0];
}

/**
 * Modify the name column of an EquipmentInstance
 * @param id ID of EquipmentInstance to modify
 * @param name new name to set
 * @returns updated EquipmentInstance
 */
export async function setInstanceName(id: number, name: string): Promise<EquipmentInstancesRow> {
    return (await knex("EquipmentInstances").update({name}).where({id}).returning("*"))[0];
}

/**
 * Delete a specified EquipmentInstance
 * @param id unique ID of instance to delete
 * @returns true
 */
export async function deleteInstance(id: number): Promise<boolean> {
    await knex("EquipmentInstances").delete().where({id});
    return true;
}