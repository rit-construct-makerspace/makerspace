import { Privilege, StudentUserInput, User } from "../../schemas/usersSchema";
import { knex } from "../../db";
import {
  singleUserToDomain,
  usersToDomain,
} from "../../mappers/users/userMapper";

/*
todo
get users by room,
search/get users by name
get users by module
*/

export async function getUsers(): Promise<User[]> {
  const knexResult = await knex("Users").select(
    "Users.id",
    "Users.firstName",
    "Users.lastName",
    "Users.email",
    "Users.isStudent",
    "Users.privilege",
    "Users.registrationDate",
    "Users.expectedGraduation",
    "Users.college",
    "Users.major"
  );

  return usersToDomain(knexResult);
}

export async function getUserByID(userID: number): Promise<User | null> {
  const knexResult = await knex("Users")
    .first(
      "Users.id",
      "Users.firstName",
      "Users.lastName",
      "Users.email",
      "Users.isStudent",
      "Users.privilege",
      "Users.registrationDate",
      "Users.expectedGraduation",
      "Users.college",
      "Users.major"
    )
    .where("id", userID);

  return singleUserToDomain(knexResult);
}

export async function createStudentUser(studentUserInput: StudentUserInput) {
  const [newID] = await knex("Users").insert(studentUserInput, "id");
  return await getUserByID(newID);
}

export function updateUser(args: any) {
  throw new Error("Method not implemented.");
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
