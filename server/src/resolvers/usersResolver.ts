import * as UserRepo from "../repositories/Users/UserRepository.js";
import * as ModuleRepo from "../repositories/Training/ModuleRepository.js";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository.js";
import * as AccessCheckRepo from "../repositories/Equipment/AccessChecksRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { ApolloContext } from "../context.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";

const UsersResolvers = {
  User: {
    holds: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return HoldsRepo.getHoldsByUser(Number(parent.id));
    },

    passedModules: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return ModuleRepo.getPassedModulesByUser(Number(parent.id));
    },

    accessChecks: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return AccessCheckRepo.getAccessChecksByUserID(Number(parent.id));
    }

  },

  Query: {
    users: async (
      _parent: any,
      args: { searchText: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        const searchText = args.searchText ?? "";
        return await UserRepo.getUsers(searchText);
      }),

    usersLimit: async (
      _parent: any,
      args: { searchText: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        const searchText = args.searchText ?? "";
        return await UserRepo.getUsersLimit(searchText);
      }),

    user: async (
      _parent: any,
      args: { id: string },
      { ifAllowedOrSelf }: ApolloContext) =>
      ifAllowedOrSelf(Number(args.id), [Privilege.MENTOR, Privilege.STAFF], async () => {
        return await UserRepo.getUserByID(Number(args.id));
      }),

    currentUser: async (
      _parent: any,
      _args: any,
      { user, ifAuthenticated }: ApolloContext) =>
      ifAuthenticated(async () => {
        return user;
      }),

    numUsers: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await UserRepo.getNumUsers();
      }),

    userByUsernameorUID: async (
      _parent: any,
      args: { value: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await UserRepo.getUserByUsernameOrUID(args.value);
      }),
  },

  Mutation: {
    createUser: async (
      _parent: any,
      args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await UserRepo.createUser(args);
      }),

    updateStudentProfile: async (
      _: any,
      args: {
        userID: string;
        pronouns: string;
        college: string;
        expectedGraduation: string;
      },
      { ifAllowedOrSelf }: ApolloContext) =>
      ifAllowedOrSelf(Number(args.userID), [Privilege.MENTOR, Privilege.STAFF], async (user) => {
        return await UserRepo.updateStudentProfile({
          userID: Number(args.userID),
          pronouns: args.pronouns,
          college: args.college,
          expectedGraduation: args.expectedGraduation
        });
      }),

    setCardTagID: async (
      _parent: any,
      args: { userID: string, cardTagID: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (executingUser: any) => {
        const userSubject = await UserRepo.setCardTagID(Number(args.userID), args.cardTagID);

        await createLog(
          `{user} updated {user}'s Card Tag ID.`,
          "admin",
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: userSubject.id, label: getUsersFullName(userSubject) }
        );
      }),

    setNotes: async (
      _parent: any,
      args: { userID: string, notes: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (executingUser: any) => {
        console.log("test")
        const userSubject = await UserRepo.setNotes(Number(args.userID), args.notes);
      }),

    setPrivilege: async (
      _parent: any,
      args: { userID: string; privilege: Privilege },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (executingUser: any) => {
        const userSubject = await UserRepo.setPrivilege(Number(args.userID), args.privilege);

        await createLog(
          `{user} set {user}'s access level to ${args.privilege}.`,
          "admin",
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: userSubject.id, label: getUsersFullName(userSubject) }
        );
      }),

    archiveUser: async (
      _parent: any,
      args: { userID: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.STAFF],
        async (user: any) => {

          const userSubject = await UserRepo.getUserByID(Number(args.userID));

          await createLog(
            `{user} archived {user}'s profile.`,
            "admin",
            { id: user.id, label: getUsersFullName(user) },
            { id: args.userID, label: getUsersFullName(userSubject) }
          );

          return await UserRepo.archiveUser(Number(args.userID));
        }
      ),
  }
};

export default UsersResolvers;
