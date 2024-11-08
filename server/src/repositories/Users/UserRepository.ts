/** UserRepository.ts
 * DB operations endpoint for Users table
 */

import { Privilege } from "../../schemas/usersSchema.js";
import { knex } from "../../db/index.js";
import { createLog } from "../AuditLogs/AuditLogRepository.js";
import { EntityNotFound } from "../../EntityNotFound.js";
import { UserRow } from "../../db/tables.js";
import { createHash } from "crypto";
import { use } from "passport";
import { User } from "@node-saml/passport-saml/lib/types.js";


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
 * @param searchText text to narrow by user name
 * @returns {UserRow[]} users
 */
export async function getUsers(searchText?: string): Promise<UserRow[]> {
  return knex("Users").select()
  .whereRaw(searchText && searchText != "" ? `("ritUsername" || "firstName" || ' ' || "lastName") ilike '%${searchText}%'` : ``)
  .orderBy("ritUsername", "ASC");
}

/**
 * Fetch all users in the table
 * @param searchText text to narrow by user name
 * @returns {UserRow[]} users
 */
export async function getUsersLimit(searchText?: string): Promise<UserRow[]> {
  var withHolds = (await knex("Users").select()
  .leftJoin(knex.raw(`(select "id" as "hid", "userID", "removerID" from "Holds") as h on h."userID" = "Users"."id"`))
  .whereRaw(searchText && searchText != "" ? `("ritUsername" || "firstName" || ' ' || "lastName") ilike '%${searchText}%'` : ``)
  .whereRaw(`h."hid" IS NOT NULL`).andWhereRaw(`h."removerID" IS NULL`)
  .orderBy("Users.ritUsername", "ASC")
  .limit(100));
  var withoutHolds = (await knex("Users").select()
  .leftJoin(knex.raw(`(select "id" as "hid", "userID", "removerID" from "Holds") as h on h."userID" = "Users"."id"`))
  .whereRaw(searchText && searchText != "" ? `("ritUsername" || "firstName" || ' ' || "lastName") ilike '%${searchText}%'` : ``)
  .whereRaw(`h."hid" IS NULL`)
  .orderBy("Users.ritUsername", "ASC")
  .limit(100));

  return withHolds.concat(withoutHolds);
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
 * Fetch a user by their ID (NOT university ID)
 * @param userID the ID of the user
 * @returns the user object
 */
export async function getUserByIDOrUndefined(userID: number): Promise<UserRow | undefined> {
  const user = await knex("Users").first().where("id", userID);
  
  if (!user) return undefined

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
 * Fetch a user by the hash on their RIT ID
 * @param cardTagID the hash retrieved from scanning an RIT ID
 * @returns the user object
 */
export async function getUserByCardTagID(
  cardTagID: string
): Promise<UserRow | undefined> {
  return knex("Users").first().where("cardTagID", cardTagID);
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
  return await getUserByID(newID.id);
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
}): Promise<UserRow> {
  const user = await getUserByID(args.userID);
  //user.universityID = hashUniversityID(user.universityID);

  if (!user.setupComplete) {
    await createLog("{user} has joined The SHED!", 
      "server",
      {
        id: args.userID,
        label: getUsersFullName(user),
    });
  }

  await knex("Users").where({ id: args.userID }).update({
    pronouns: args.pronouns,
    college: args.college,
    expectedGraduation: args.expectedGraduation,
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

/**
 * Update the Card Tag ID of a user
 * @param userID the ID of the user to update
 * @param cardTagID the ID string to set
 * @returns updated user
 */
export async function setCardTagID(
  userID: number,
  cardTagID: string
): Promise<UserRow> {
  await knex("Users").where({ id: userID }).update("cardTagID", cardTagID);
  return await getUserByID(userID);
}


/**
 * Update the Notes of a user
 * @param userID the ID of the user to update
 * @param notes the notes string to set
 * @returns updated user
 */
export async function setNotes(
  userID: number,
  notes: string
): Promise<UserRow> {
  await knex("Users").where({ id: userID }).update("notes", notes);
  return await getUserByID(userID);
}

export async function archiveUser(userID: number): Promise<UserRow> {
  await knex("Users").where({ id: userID }).update({ archived: true });
  return await getUserByID(userID);
}


export async function getNumUsers(): Promise<string> {
  return (await knex("Users").count("*"))[0];
}