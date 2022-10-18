import { knex } from "../../db";
import { ModuleSubmissionRow } from "../../db/tables";
import { EntityNotFound } from "../../EntityNotFound";

export async function getSubmission(
    userID: number,
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
    userID: number
): Promise<ModuleSubmissionRow[]> {
    const submission = await knex("ModuleSubmissions")
        .select()
        .where(
            {
                makerID: userID,
            }
        );

    if (!submission) throw new EntityNotFound("Could not find any submissions for this user");
  
    return submission;
}

export async function getSubmissionsByModule(
    userID: number,
    moduleID: number
): Promise<ModuleSubmissionRow[]> {
    return await knex("ModuleSubmissions")
        .select()
        .where(
            {
                makerID: userID,
                moduleID: moduleID
            }
        );
}

export async function getLatestSubmission(
    userID: number
): Promise<ModuleSubmissionRow | undefined> {
    let res = await knex("ModuleSubmissions")
        .where("makerID", userID)
        .orderBy("submissionDate", "desc")
        .first();
    return res;
}

export async function getLatestSubmissionByModule(
    userID: number,
    moduleID: number
): Promise<ModuleSubmissionRow | undefined> {
    const submission = await knex("ModuleSubmissions")
        .where("makerID", userID)
        .andWhere("moduleID", moduleID)
        .orderBy("submissionDate", "desc")
        .first();

    if (!submission) throw new EntityNotFound("Could not find submission for module ${moduleID}");
  
    return submission;
}
