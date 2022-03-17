import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../server";

const UsersResolvers = {
  Query: {
    users: async () => {
      return await UserRepo.getUsers();
    },

    user: async (parent: any, args: { id: number }) => {
      return await UserRepo.getUserByID(args.id);
    },

    currentUser: async (parent: any, args: any, context: ApolloContext) => {
      return context.getUser();
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
      }
    ) => {
      return await UserRepo.updateStudentProfile(args);
    },

    setPrivilege: async (
      parent: any,
      { userID, privilege }: { userID: number; privilege: Privilege }
    ) => {
      return await UserRepo.setPrivilege(userID, privilege);
    },

    addTraining: async (parent: any, args: any) => {
      await UserRepo.addTrainingToUser(args.userID, args.trainingModuleID);
    },

    removeTraining: async (parent: any, args: any) => {
      await UserRepo.removeTrainingFromUser(args.userID, args.trainingModuleID);
    },

    addHold: async (parent: any, args: any) => {
      await UserRepo.addHoldToUser(args.userID, args.holdID);
    },

    removeHold: async (parent: any, args: any) => {
      await UserRepo.removeHoldFromUser(args.userID, args.holdID);
    },
  },
};

export default UsersResolvers;
