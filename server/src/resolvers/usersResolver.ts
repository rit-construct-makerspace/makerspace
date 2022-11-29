import * as UserRepo from "../repositories/Users/UserRepository";
import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { ApolloContext, ifAllowed } from "../context";
import { getUsersFullName } from "../repositories/Users/UserRepository";

const UsersResolvers = {
  User: {
    passedModules: (parent: { id: number }) => {
      return ModuleRepo.getPassedModulesByUser(parent.id);
    },
  },

  Query: {
    users: async (
      _parent: any,
      _args: any,
      {ifAllowed}: ApolloContext) => {
        ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async () => {
          return await UserRepo.getUsers();
        });
    },

    user: async (
      _parent: any,
      args: { id: string },
      {ifAllowedOrSelf} : ApolloContext) => {
        ifAllowedOrSelf(args.id, [Privilege.LABBIE, Privilege.ADMIN], async () => {
          return await UserRepo.getUserByID(args.id);
        });
    },

    currentUser: async (
      _parent: any,
      _args: any,
      context: ApolloContext) => {
        return context.user;
    },
  },

  Mutation: {
    createUser: async (
      _parent: any,
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
      context: ApolloContext) =>
      {
        console.log(context.user);
        return context.ifAllowedOrSelf(args.userID, [Privilege.LABBIE, Privilege.ADMIN], async (user) => {
          return await UserRepo.updateStudentProfile({
            userID: args.userID,
            pronouns: args.pronouns,
            college: args.college,
            expectedGraduation: args.expectedGraduation,
            universityID: args.universityID
          });
        });
      },

    setPrivilege: async (
      _: any,
      { userID, privilege }: { userID: string; privilege: Privilege },
      { ifAllowed }: ApolloContext) => {

        let result = ifAllowed([Privilege.LABBIE, Privilege.MAKER], async (executingUser) => {
          const userSubject = await UserRepo.setPrivilege(userID, privilege);

          await createLog(
            `{user} set {user}'s access level to ${privilege}.`,
            { id: executingUser.id, label: getUsersFullName(executingUser) },
            { id: userSubject.id, label: getUsersFullName(userSubject) }
          );
        });
    },

    deleteUser: async (
      parents: any,
      args: { userID: number },
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
