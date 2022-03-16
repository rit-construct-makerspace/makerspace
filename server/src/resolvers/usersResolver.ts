import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../server";

//TODO: Update all "args" parameters upon implementation
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
    updateFacultyUser: async (parent: any, args: any) => {
      await UserRepo.updateUser(args);
    },

    updateStudentUser: async (parent: any, args: any) => {
      await UserRepo.updateUser(args);
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
