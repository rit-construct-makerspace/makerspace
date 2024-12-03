import { knex } from "../../db/index.js";
import { TrainingHoldsRow } from "../../db/tables.js";

export async function getTrainingHolds(): Promise<TrainingHoldsRow[]> {
    return await knex("TrainingHolds").select();
}

export async function getTrainingHoldsByUser(userID: number): Promise<TrainingHoldsRow[]> {
    return await knex("TrainingHolds").select().where({userID}).andWhere("expires", ">=", knex.fn.now());
}

export async function getTrainingHoldByUserForModule(userID: number, moduleID: number): Promise<TrainingHoldsRow | undefined> {
    return await knex("TrainingHolds").select().where({userID, moduleID}).andWhere("expires", ">=", knex.fn.now()).first();
}

export async function getTrainingHoldByID(id: number): Promise<TrainingHoldsRow | undefined> {
    return await knex("TrainingHolds").select().where({id}).first();
}

export async function createTrainingHold(userID: number, moduleID: number, expires?: Date): Promise<boolean> {
    if (!expires) {
        expires = new Date();
        expires.setDate(expires.getDate()+1);
        expires.setHours(0);
        expires.setMinutes(0);
        expires.setSeconds(0);
    }
    await knex("TrainingHolds").insert({userID, moduleID, expires});
    return true;
}

export async function deleteExpiredTrainingHolds(): Promise<boolean> {
    await knex("TrainingHolds").delete().where("expires", "<", knex.fn.now());
    return true;
}

export async function deleteTrainingHold(id: number): Promise<boolean> {
    await knex("TrainingHolds").delete().where({id});
    return true;
}

export async function getActiveTrainingHoldsByUser(userID: number): Promise<TrainingHoldsRow[]> {
    return await deleteExpiredTrainingHolds().then(async () => {
        return await getTrainingHoldsByUser(userID);
    });
}