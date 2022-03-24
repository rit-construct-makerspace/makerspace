import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege, User } from "../schemas/usersSchema";
import { ApolloContext } from "../server";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import assert from "assert";
import { createHash } from "crypto";

export function getUsersFullName(user: User) {
  return `${user.firstName} ${user.lastName}`;
}

export function hashUniversityID(universityID: string) {
  return createHash("sha256").update(universityID).digest("hex");
}

//TODO: Update all "args" parameters upon implementation
const UsersResolvers = {
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

    addTraining: async (_: any, args: any, context: any) => {
      await UserRepo.addTrainingToUser(args.userID, args.trainingModuleID);
    },

    removeTraining: async (_: any, args: any, context: any) => {
      await UserRepo.removeTrainingFromUser(args.userID, args.trainingModuleID);
    },

    addHold: async (_: any, args: any, context: any) => {
      await UserRepo.addHoldToUser(args.userID, args.holdID);
    },

    removeHold: async (_: any, args: any, context: any) => {
      await UserRepo.removeHoldFromUser(args.userID, args.holdID);
    },

    archiveUser: async (parents: any, args: {userID: number}, context: any) => {
      return await UserRepo.archiveUser(args.userID);
    }
  },
};

export default UsersResolvers;
