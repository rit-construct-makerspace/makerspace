import * as UserRepo from "../repositories/Users/UserRepository";
import { StudentUserInput } from "../schemas/usersSchema";

//TODO: Update all "args" parameters upon implementation
const UsersResolvers = {
  Query: {
    users: async () => {
      return await UserRepo.getUsers();
    },

    user: async (_: any, args: { id: number }) => {
      return await UserRepo.getUserByID(args.id);
    },
  },

  Mutation: {
    createStudentUser: async (_: any, { user }: { user: StudentUserInput }) => {
      return await UserRepo.createStudentUser(user);
    },

    createFacultyUser: async (_: any, args: any) => {
      return UserRepo.createStudentUser(args);
    },

    updateFacultyUser: async (_: any, args: any) => {
      await UserRepo.updateUser(args);
    },

    updateStudentUser: async (_: any, args: any) => {
      await UserRepo.updateUser(args);
    },

    addTraining: async (_: any, args: any) => {
      await UserRepo.addTrainingToUser(args.userID, args.trainingModuleID);
    },

    removeTraining: async (_: any, args: any) => {
      await UserRepo.removeTrainingFromUser(args.userID, args.trainingModuleID);
    },

    addHold: async (_: any, args: any) => {
      await UserRepo.addHoldToUser(args.userID, args.holdID);
    },

    removeHold: async (_: any, args: any) => {
      await UserRepo.removeHoldFromUser(args.userID, args.holdID);
    },
  },
};

export default UsersResolvers;
