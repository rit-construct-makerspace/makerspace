import { Privilege } from "../../schemas/usersSchema";
import { knex } from "../../db";
import { createLog } from "../AuditLogs/AuditLogRepository";
import { EntityNotFound } from "../../EntityNotFound";
import { UserRow } from "../../db/tables";
import { createHash } from "crypto";
import { use } from "passport";

export function getUsersFullName(user: UserRow) {
  return `${user.firstName} ${user.lastName}`;
}

export function hashUniversityID(universityID: string) {
  return createHash("sha256").update(universityID).digest("hex");
}

export async function getUsers(): Promise<UserRow[]> {
  return knex("Users").select();
}

export async function getUserByID(userID: number): Promise<UserRow> {
  const user = await knex("Users").first().where("id", userID);
  
  if (!user) throw new EntityNotFound(`User #${userID} not found`);

  return user;
}

export async function getUserByRitUsername(
  ritUsername: string
): Promise<UserRow | undefined> {
  return knex("Users").first().where("ritUsername", ritUsername);
}

export async function getUserByUniversityID(
  universityID: string
): Promise<UserRow | undefined> {
  const hashedUniversityID = hashUniversityID(universityID);
  return knex("Users").first().where({ universityID: hashedUniversityID });
}

export async function createUser(user: {
  firstName: string;
  lastName: string;
  ritUsername: string;
  email: string;
}): Promise<UserRow> {
  const [newID] = await knex("Users").insert(user, "id");
  return await getUserByID(newID);
}

export async function updateStudentProfile(args: {
  userID: number;
  pronouns: string;
  college: string;
  expectedGraduation: string;
  universityID: string;
}): Promise<UserRow> {
  const user = await getUserByID(args.userID);

  if (!user.setupComplete) {
    await createLog("{user} has joined The Construct!", {
      id: args.userID,
      label: getUsersFullName(user),
    });
  }

  await knex("Users").where({ id: args.userID }).update({
    pronouns: args.pronouns,
    college: args.college,
    expectedGraduation: args.expectedGraduation,
    universityID: hashUniversityID(args.universityID),
    setupComplete: true,
  });

  return getUserByID(args.userID);
}

export async function setPrivilege(
  userID: number,
  privilege: Privilege
): Promise<UserRow> {
  await knex("Users").where({ id: userID }).update({ privilege });
  return await getUserByID(userID);
}

export async function archiveUser(userID: number): Promise<UserRow> {
  await knex("Users").where({ id: userID }).update({ archived: true });
  return await getUserByID(userID);
}
