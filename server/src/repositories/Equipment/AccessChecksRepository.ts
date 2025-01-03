/** AccessChecksRepository.ts
 * DB operations endpoint for AccessChecks table
 */

import { knex } from "../../db/index.js";
import { AccessCheckRow } from "../../db/tables.js";



export async function getAccessChecks(): Promise<AccessCheckRow[]> {
    return await knex("AccessChecks").select("*");
}

export async function getAccessChecksByUserID(userID: number): Promise<AccessCheckRow[] | undefined> {
    return await knex("AccessChecks").select("*").where({userID});
}

export async function getAccessCheckByID(id: number): Promise<AccessCheckRow | undefined> {
    return await knex("AccessChecks").select("*").first().where({id: id});
}

export async function accessCheckExists(userID: number, equipmentID: number): Promise<boolean> {
    return (await knex("AccessChecks").select("*").first().where({userID: userID, equipmentID: equipmentID})) != undefined;
}

export async function hasApprovedAccessCheck(userID: number, equipmentID: number): Promise<boolean | undefined> {
    return (await knex("AccessChecks").select("*").first().where({userID: userID, equipmentID: equipmentID}))?.approved
}

export async function getAccessChecksByApproved(approved: boolean): Promise<AccessCheckRow[]> {
    return await knex("AccessChecks").select("*").where({approved: approved});
}

export async function createAccessCheck(userID: number, equipmentID: number): Promise<AccessCheckRow> {
    return await knex("AccessChecks").insert({
        userID: userID,
        equipmentID: equipmentID
    });
}

export async function setAccessCheckApproval(id: number, approved: boolean): Promise<AccessCheckRow | undefined> {
    await knex("AccessChecks").update({
        approved: approved
    }).where({id: id});
    return await getAccessCheckByID(id);
}

export async function isApproved(userID: number, equipmentID: number): Promise<boolean> {
    const check = await knex("AccessChecks").select("*").where({userID: userID, equipmentID: equipmentID }).first();
    if (check?.approved) return true;
    return false;
}

export async function purgeUnapprovedAccessChecks(userID: number): Promise<boolean> {
    await knex("AccessChecks").delete().where({userID, approved: false});
    return true;
}