import { User } from "../../schemas/usersSchema";

export function usersToDomain(raw: any): User[] {
  return raw.map((i: any) => singleUserToDomain(i));
}

export function singleUserToDomain(raw: any): User | null {
  if (!raw) return null;

  return {
    id: raw.id,
    universityID: raw.universityID,
    ritUsername: raw.ritUsername,
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
    roomID: raw.roomID,
    pronouns: raw.pronouns,
    setupComplete: raw.setupComplete,
    isArchived: raw.isArchived
  };
}
