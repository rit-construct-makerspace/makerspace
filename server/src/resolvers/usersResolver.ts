import * as UserRepo from "../repositories/Users/UserRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import assert from "assert";
import { ApolloContext } from "../context";
import { getUsersFullName, hashUniversityID } from "../repositories/Users/UserRepository";
import { ForbiddenError } from "apollo-server-express";

const UsersResolvers = {
  User: {
    passedModules: (parent: { id: string }) => {
      return ModuleRepo.getPassedModulesByUser(parent.id);
    },
  },

  Query: {
    users: async (_: any,
      _args: {null: any},
      {ifAllowed}: ApolloContext) =>
        ifAllowed([Privilege.ADMIN], async (user) => {
          return await UserRepo.getUsers();
    }),

    user: async (_: any, args: { id: string }) => {
      return await UserRepo.getUserByID(args.id);
    },

    currentUser: async (parent: any, args: any, context: ApolloContext) => {
      return context.user;
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      args: any,
      { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async () => {
          return await UserRepo.createUser(args);
    }),

    updateStudentProfile: async (
      _: any,
      args: {
        userID: string;
        pronouns: string;
        college: string;
        expectedGraduation: string;
        universityID: string;
      },
      { ifAllowed }: ApolloContext) =>
      {
        return ifAllowed([Privilege.MAKER, Privilege.LABBIE, Privilege.ADMIN], async (user) => {
          if (user.id === args.userID) {  
            return await UserRepo.updateStudentProfile({
              userID: args.userID,
              pronouns: args.pronouns,
              college: args.college,
              expectedGraduation: args.expectedGraduation,
              universityID: args.universityID
            });
          }
          else {
            return ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async () => {  
              return await UserRepo.updateStudentProfile({
                userID: args.userID,
                pronouns: args.pronouns,
                college: args.college,
                expectedGraduation: args.expectedGraduation,
                universityID: args.universityID
              });
            });
          }
        });
      },

    setPrivilege: async (
      _: any,
      { userID, privilege }: { userID: string; privilege: Privilege },
      context: ApolloContext) => {
        assert(context.user);

        const userSubject = await UserRepo.setPrivilege(userID, privilege);
        assert(userSubject);

        await createLog(
          `{user} set {user}'s access level to ${privilege}.`,
          { id: context.user.id, label: getUsersFullName(context.user) },
          { id: userSubject.id, label: getUsersFullName(userSubject) }
        );
    },

    deleteUser: async (
      parents: any,
      args: { userID: string },
      {ifAllowed}: ApolloContext) => {
        return ifAllowed(
          [Privilege.ADMIN],
          async (user) => {

            const userSubject = await UserRepo.getUserByID(args.userID);

            await createLog(
              `{user} deleted {user}'s profile.`,
              { id: user.id, label: getUsersFullName(user) },
              { id: args.userID, label: getUsersFullName(userSubject) }
            );

            return await UserRepo.archiveUser(args.userID);
          }
        );
    },
  },
};

export default UsersResolvers;
