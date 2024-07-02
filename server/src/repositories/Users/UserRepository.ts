/** UserRepository.ts
 * DB operations endpoint for Users table
 */

import { Privilege } from "../../schemas/usersSchema";
import { knex } from "../../db";
import { createLog } from "../AuditLogs/AuditLogRepository";
import { EntityNotFound } from "../../EntityNotFound";
import { UserRow } from "../../db/tables";
import { createHash } from "crypto";
import { use } from "passport";


/**
 * Get display friendly full name
 * @param user {UserRow} the user object
 * @returns the full name by "FirstName LastName" format
 */
export function getUsersFullName(user: UserRow) {
  return `${user.firstName} ${user.lastName}`;
}

/**
 * Hash the university ID
 * @param universityID the universtiy ID to hash
 * @returns the userID as a sha256 hex
 */
export function hashUniversityID(universityID: string) {
  return createHash("sha256").update(universityID).digest("hex");
}

/**
 * Fetch all users in the table
 * @returns {UserRow[]} users
 */
export async function getUsers(): Promise<UserRow[]> {
  return knex("Users").select();
}

/**
 * Fetch a user by their ID (NOT university ID)
 * @param userID the ID of the user
 * @returns the user object
 */
export async function getUserByID(userID: number): Promise<UserRow> {
  const user = await knex("Users").first().where("id", userID);
  
  if (!user) throw new EntityNotFound(`User #${userID} not found`);

  return user;
}

/**
 * Fetch a user by their username
 * @param ritUsername the unique username of a user
 * @returns the user object
 */
export async function getUserByRitUsername(
  ritUsername: string
): Promise<UserRow | undefined> {
  console.log("Checking user: " + ritUsername);
  return knex("Users").first().where("ritUsername", ritUsername);
}

/**
 * Fetch a user by their University ID
 * @param universityID th user's university ID
 * @returns the user object
 */
export async function getUserByUniversityID(
  universityID: string
): Promise<UserRow | undefined> {
  const hashedUniversityID = hashUniversityID(universityID);
  return knex("Users").first().where({ universityID: hashedUniversityID });
}

/**
 * Create a USer and append it to the table
 * @param user the user object
 * @returns the added User
 */
export async function createUser(user: {
  firstName: string;
  lastName: string;
  ritUsername: string;
  universityID: string;
}): Promise<UserRow> {
  console.log("Creating user entry: " + user.ritUsername);
  user.universityID = hashUniversityID(user.universityID);
  const [newID] = await knex("Users").insert(user, "id");
  return await getUserByID(newID);
}

/**
 * Update a user at userID
 * @param args the updated user information
 * @returns updated user
 */
export async function updateStudentProfile(args: {
  userID: number;
  pronouns: string;
  college: string;
  expectedGraduation: string;
  universityID: string;
}): Promise<UserRow> {
  const user = await getUserByID(args.userID);
  user.universityID = hashUniversityID(user.universityID);

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

/**
 * Update the privlege value of a user
 * @param userID the ID of the user to update
 * @param privilege the privlege to set
 * @returns updated user
 */
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
