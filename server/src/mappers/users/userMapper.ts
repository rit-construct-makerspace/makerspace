import { User } from "../../schemas/usersSchema";

export function usersToDomain(raw: any): User[] {
  return raw.map((i: any) => singleUserToDomain(i));
}

export function singleUserToDomain(raw: any): User | null {
  if (!raw) return null;

  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    isStudent: raw.isStudent,
    privilege: raw.privilege,
    registrationDate: raw.registrationDate,
    holds: raw.holds,
    completedModules: raw.trainingModules,
    expectedGraduation: raw.expectedGraduation,
    college: raw.college,
    major: raw.major,
    roomID: raw.roomID,
  };
}