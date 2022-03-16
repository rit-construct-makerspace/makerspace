import * as UserRepo from "../repositories/Users/UserRepository";
import { Privilege, StudentUserInput } from "../schemas/usersSchema";
import { createHash } from "crypto";

//TODO: Update all "args" parameters upon implementation
const UsersResolvers = {
  Query: {
    users: async () => {
      return await UserRepo.getUsers();
    },

    user: async (_: any, args: { id: number }) => {
      return await UserRepo.getUserByID(args.id);
    },

    currentUser: async (parent: any, args: any, context: any) => {
      console.log(context.getUser());
      return null;
    },
  },

  Mutation: {
    createStudentUser: async (_: any, { user }: { user: StudentUserInput }) => {
      const hashedUniversityID = createHash("sha256")
        .update(user.universityID)
        .digest("hex");

      return await UserRepo.createStudentUser({
        ...user,
        universityID: hashedUniversityID,
      });
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

    setPrivilege: async (
      _: any,
      { userID, privilege }: { userID: number; privilege: Privilege }
    ) => {
      return await UserRepo.setPrivilege(userID, privilege);
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
