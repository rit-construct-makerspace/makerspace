import { Privilege, User } from "../../schemas/usersSchema";
import { knex } from "../../db";
import {
  singleUserToDomain,
  usersToDomain,
} from "../../mappers/users/userMapper";
import { createLog } from "../AuditLogs/AuditLogRepository";
import assert from "assert";
import { getUsersFullName } from "../../resolvers/usersResolver";

/*
todo
get users by room,
search/get users by name
get users by module
*/

export async function getUsers(): Promise<User[]> {
  const knexResult = await knex("Users").select();
  return usersToDomain(knexResult);
}

export async function getUserByID(userID: number): Promise<User | null> {
  const knexResult = await knex("Users").first().where("id", userID);
  return singleUserToDomain(knexResult);
}

export async function getUserByRitUsername(
  ritUsername: string
): Promise<User | null> {
  const knexResult = await knex("Users")
    .first()
    .where("ritUsername", ritUsername);
  return singleUserToDomain(knexResult);
}

export async function createUser(user: {
  firstName: string;
  lastName: string;
  ritUsername: string;
  email: string;
}) {
  const [newID] = await knex("Users").insert(user, "id");
  return await getUserByID(newID);
}

export async function updateStudentProfile(args: {
  userID: number;
  pronouns: string;
  college: string;
  expectedGraduation: string;
}): Promise<User | null> {
  const { userID, pronouns, college, expectedGraduation } = args;

  const user = await getUserByID(userID);
  assert(user);

  const alreadySetup = user.setupComplete;

  if (!alreadySetup) {
    await createLog("{user} has joined The Construct!", {
      id: userID,
      label: getUsersFullName(user),
    });
  }

  await knex("Users")
    .where({ id: userID })
    .update({ pronouns, college, expectedGraduation, setupComplete: true });

  return getUserByID(userID);
}

export async function setPrivilege(userID: number, privilege: Privilege) {
  await knex("Users").where({ id: userID }).update({ privilege });
  return getUserByID(userID);
}

export function addTrainingToUser(userID: number, trainingModuleID: number) {
  throw new Error("Method not implemented.");
}

export function removeTrainingFromUser(
  userID: number,
  trainingModuleID: number
) {
  throw new Error("Method not implemented.");
}

export function addHoldToUser(userID: number, holdID: number) {
  throw new Error("Method not implemented.");
}

export function removeHoldFromUser(userID: number, holdID: number) {
  throw new Error("Method not implemented.");
}

export async function archiveUser(userID: number){
  await knex("Users").where({ id: userID}).update({isArchived: true})
  return await getUserByID(userID)
}
