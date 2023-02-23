import { knex } from "../../db";
import { ModuleSubmissionRow } from "../../db/tables";
import { EntityNotFound } from "../../EntityNotFound";

export async function addSubmission(
    makerID: number,
    moduleID: number,
    passed: boolean
) {
    return await knex("ModuleSubmissions").insert({ makerID, moduleID, passed }).returning('id');
}

export async function getSubmission(
    submissionID: number
): Promise<ModuleSubmissionRow | undefined>  {
    const submission = await knex("ModuleSubmissions")
    .select()
    .where(
        {
            id: submissionID
        }
    )
    .first();

    if (!submission) throw new EntityNotFound("Could not find submission id ${submissionID}");
  
    return submission;
}

export async function getSubmissionsByUser(
    makerID: number
): Promise<ModuleSubmissionRow[]> {
    const submission = await knex("ModuleSubmissions")
        .select()
        .where(
            {
                makerID: makerID,
            }
        );

    if (!submission) throw new EntityNotFound("Could not find any submissions for this user");
  
    return submission;
}

export async function getSubmissionsByModule(
    makerID: number,
    moduleID: number
): Promise<ModuleSubmissionRow[]> {
    return await knex("ModuleSubmissions")
        .select()
        .where(
            {
                makerID: makerID,
                moduleID: moduleID
            }
        );
}

export async function getLatestSubmission(
    makerID: number
): Promise<ModuleSubmissionRow | undefined> {
    let res = await knex("ModuleSubmissions")
        .where("makerID", makerID)
        .orderBy("submissionDate", "desc")
        .first();
    return res;
}

export async function getLatestSubmissionByModule(
    makerID: number,
    moduleID: number
): Promise<ModuleSubmissionRow | undefined> {
    const submission = await knex("ModuleSubmissions")
        .where("makerID", makerID)
        .andWhere("moduleID", moduleID)
        .orderBy("submissionDate", "desc")
        .first();

    // if (!submission) throw new EntityNotFound("Could not find submission for module ${moduleID}");
  
    return submission;
}
