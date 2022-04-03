import * as UserRepo from "../repositories/Users/UserRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import assert from "assert";
import { createHash } from "crypto";
import { ApolloContext } from "../context";
import { UserRow } from "../db/tables";

export function getUsersFullName(user: UserRow) {
  return `${user.firstName} ${user.lastName}`;
}

export function hashUniversityID(universityID: string) {
  return createHash("sha256").update(universityID).digest("hex");
}

const UsersResolvers = {
  User: {
    passedModules: (parent: { id: number }) => {
      return ModuleRepo.getPassedModulesByUser(parent.id);
    },
  },

  Query: {
    users: async () => {
      return await UserRepo.getUsers();
    },

    user: async (_: any, args: { id: number }) => {
      return await UserRepo.getUserByID(args.id);
    },

    currentUser: async (parent: any, args: any, context: ApolloContext) => {
      return context.user;
    },
  },

  Mutation: {
    createUser: async (_: any, args: any, context: any) => {
      return await UserRepo.createUser(args);
    },

    updateStudentProfile: async (
      parent: any,
      args: {
        userID: number;
        pronouns: string;
        college: string;
        expectedGraduation: string;
        universityID: string;
      },
      context: any
    ) => {
      const hashedUniversityID = hashUniversityID(args.universityID);

      return await UserRepo.updateStudentProfile({
        ...args,
        universityID: hashedUniversityID,
      });
    },

    setPrivilege: async (
      _: any,
      { userID, privilege }: { userID: number; privilege: Privilege },
      context: ApolloContext
    ) => {
      assert(context.user);

      const userSubject = await UserRepo.setPrivilege(userID, privilege);
      assert(userSubject);

      await createLog(
        `{user} set {user}'s access level to ${privilege}.`,
        { id: context.user.id, label: getUsersFullName(context.user) },
        { id: userSubject.id, label: getUsersFullName(userSubject) }
      );
    },

    archiveUser: async (
      parents: any,
      args: { userID: number },
      context: any
    ) => {
      return await UserRepo.archiveUser(args.userID);
    },
  },
};

export default UsersResolvers;
