import { User } from "../../models/users/user";

export function usersToDomain(raw: any): User[] {
  return raw.map((i: any) => singleUserToDomain(i));

}

export function singleUserToDomain(raw: any): User | null {
  if (raw === undefined || raw === null) return null;
  const value: User= {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    isStudent: raw.isStudent,
    privilege: raw.privilege,
    registrationDate: raw.registrationDate,
    holds: raw.holds,
    trainingModules: raw.trainingModules,
    year: raw.year,
    college: raw.college,
    major: raw.major,
    aboutMe: raw.aboutMe,
    roomID: raw.roomID
  }
  return value;
}
