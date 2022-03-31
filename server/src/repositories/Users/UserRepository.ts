import { Privilege, User } from "../../schemas/usersSchema";
import { knex } from "../../db";
import {
  singleUserToDomain,
  usersToDomain,
} from "../../mappers/users/userMapper";
import { createLog } from "../AuditLogs/AuditLogRepository";
import assert from "assert";
import { getUsersFullName } from "../../resolvers/usersResolver";
import { EntityNotFound } from "../../EntityNotFound";

export async function getUsers(): Promise<User[]> {
  const knexResult = await knex("Users").select();
  return usersToDomain(knexResult);
}

export async function getUserByID(userID: number): Promise<User> {
  const knexResult = await knex("Users").first().where("id", userID);
  const user = singleUserToDomain(knexResult);

  if (!user) throw new EntityNotFound(`User #${userID} not found`);

  return user;
}

export async function getUserByRitUsername(
  ritUsername: string
): Promise<User | null> {
  const knexResult = await knex("Users")
    .first()
    .where("ritUsername", ritUsername);

  return singleUserToDomain(knexResult);
}

export async function getUserByUniversityID(
  universityID: string
): Promise<User | null> {
  const result = await knex("Users").first().where({ universityID });
  return singleUserToDomain(result);
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
  universityID: string;
}): Promise<User | null> {
  const user = await getUserByID(args.userID);
  assert(user);

  const alreadySetup = user.setupComplete;

  if (!alreadySetup) {
    await createLog("{user} has joined The Construct!", {
      id: args.userID,
      label: getUsersFullName(user),
    });
  }

  await knex("Users").where({ id: args.userID }).update({
    pronouns: args.pronouns,
    college: args.college,
    expectedGraduation: args.expectedGraduation,
    universityID: args.universityID,
    setupComplete: true,
  });

  return getUserByID(args.userID);
}

export async function setPrivilege(userID: number, privilege: Privilege) {
  await knex("Users").where({ id: userID }).update({ privilege });
  return getUserByID(userID);
}

export async function addTrainingModuleAttemptToUser(userID: number, trainingModuleID: string, passed: boolean) {
  await knex("ModuleSubmissions").insert({makerID: userID, moduleID: trainingModuleID, passed: passed})
}

export function removeTrainingFromUser(
  userID: number,
  trainingModuleID: number
) {
  throw new Error("Method not implemented.");
}

export async function archiveUser(userID: number) {
  await knex("Users").where({ id: userID }).update({ isArchived: true });
  return await getUserByID(userID);
}
