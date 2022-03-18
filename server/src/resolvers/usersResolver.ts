import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../server";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";

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
    updateStudentProfile: async (
      parent: any,
      args: {
        userID: number;
        pronouns: string;
        college: string;
        expectedGraduation: string;
      },
      context: any
    ) => {
      return await UserRepo.updateStudentProfile(args);
    },

    setPrivilege: async (
      _: any,
      { userID, privilege }: { userID: number; privilege: Privilege },
      context: ApolloContext
    ) => {
      await createLog(
        `user:${context.user?.id} set user:${userID}'s access level to ${privilege}.`
      );

      return await UserRepo.setPrivilege(userID, privilege);
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
  },
};

export default UsersResolvers;
