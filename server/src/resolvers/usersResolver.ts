import * as UserRepo from "../repositories/Users/UserRepository.js";
import * as ModuleRepo from "../repositories/Training/ModuleRepository.js";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository.js";
import * as AccessCheckRepo from "../repositories/Equipment/AccessChecksRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { ApolloContext } from "../context.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { getActiveTrainingHoldsByUser, getTrainingHoldsByUser } from "../repositories/Training/TrainingHoldsRespository.js";

const UsersResolvers = {
  User: {
    //Map holds field to array of Holds
    holds: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return HoldsRepo.getHoldsByUser(Number(parent.id));
    },

    //Map passedModules field to array of passed TrainingModules
    passedModules: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return ModuleRepo.getPassedModulesByUser(Number(parent.id));
    },

    //Map accessChecks to array of AccessChecks
    accessChecks: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return AccessCheckRepo.getAccessChecksByUserID(Number(parent.id));
    },

    //Map trainingHolds field to array of active TrainingHolds
    trainingHolds: async (
      parent: { id: string },
      _args: any,
      _context: ApolloContext) => {
      return getActiveTrainingHoldsByUser(Number(parent.id));
    }

  },

  Query: {
    /**
     * Fetch all users by search text
     * @argument searchText String to inclusively filter by related username, firstName, and lastName
     * @returns array of Users
     */
    users: async (
      _parent: any,
      args: { searchText: string },
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        const searchText = args.searchText ?? "";
        return await UserRepo.getUsers(searchText);
      }),

    /**
     * Fetch all users by search text with a limit of 100 users
     * @argument searchText String to inclusively filter by related username, firstName, and lastName
     * @returns array of Users
     */
    usersLimit: async (
      _parent: any,
      args: { searchText: string },
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        const searchText = args.searchText ?? "";
        return await UserRepo.getUsersLimit(searchText);
      }),

    /**
     * Fetch a user by ID
     * @argument id ID of the User
     * @returns User
     */
    user: async (
      _parent: any,
      args: { id: string },
      { ifAuthenticated }: ApolloContext) =>
      ifAuthenticated(async () => {
        return await UserRepo.getUserByID(Number(args.id));
      }),

    /**
     * Fetch the user for the current Apollo session
     * @returns User
     */
    currentUser: async (
      _parent: any,
      _args: any,
      { user, ifAuthenticated }: ApolloContext) =>
      ifAuthenticated(async () => {
        return user;
      }),

    /**
     * Fetch the number of total users
     * @returns String JSON of {count: number}
     */
    numUsers: async (
      _parent: any,
      _args: any,
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        return await UserRepo.getNumUsers();
      }),

    /**
     * Fetch a user by search string for cardTagID or ritUsername
     * @argument value string for inclusive search
     * @returns User or undefined
     */
    userByUsernameorUID: async (
      _parent: any,
      args: { value: string },
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        return await UserRepo.getUserByUsernameOrUID(args.value);
      }),
  },

  Mutation: {
    /**
     * Create a User
     * @argument firstName User's Preffered First Name
     * @argument lastName User's Last Name / Family Name
     * @argument ritUsername RIT ITS Username
     * @returns User
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    createUser: async (
      _parent: any,
      args: {
        firstName: string;
        lastName: string;
        ritUsername: string;
      },
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        return await UserRepo.createUser(args);
      }),

    /**
     * Modify a User to complete other profile items
     * @argument userID ID of User to modify
     * @argument pronouns User's pronouns (ex: "They / Them")
     * @argument college User's College shorthand (ex: "KGCOE")
     * @argument expectedGraduation Expected Graduation Year and Semester (ex: "Summer 2028")
     * @returns User
     * @throws GraphQLError if not MENTOR or STAFF or is on hold. Allow if subject user is requesting user
     */
    updateStudentProfile: async (
      _: any,
      args: {
        userID: string;
        pronouns: string;
        college: string;
        expectedGraduation: string;
      },
      { ifStaffOrSelf }: ApolloContext) =>
      ifStaffOrSelf(async (user) => {
        return await UserRepo.updateStudentProfile({
          userID: Number(args.userID),
          pronouns: args.pronouns,
          college: args.college,
          expectedGraduation: args.expectedGraduation
        });
      }),

    /**
     * Modify a User's cardTagID
     * @argument userID ID of User to modify
     * @argument cardTagID New value
     * @returns User
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    setCardTagID: async (
      _parent: any,
      args: { userID: string, cardTagID: string },
      { isStaff }: ApolloContext
    ) =>
      isStaff(async (executingUser: any) => {
        const userSubject = await UserRepo.setCardTagID(Number(args.userID), args.cardTagID);

        await createLog(
          `{user} updated {user}'s Card Tag ID.`,
          "admin",
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: userSubject.id, label: getUsersFullName(userSubject) }
        );
      }),

    /**
     * Modify a User's notes field
     * @argument userID ID of User to modify
     * @argument notes New value
     * @returns User
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    setNotes: async (
      _parent: any,
      args: { userID: string, notes: string },
      { isStaff }: ApolloContext
    ) =>
      isStaff(async (executingUser: any) => {
        const userSubject = await UserRepo.setNotes(Number(args.userID), args.notes);
      }),

    /**
     * Modify a User's Privilege
     * @argument userID ID of User to modify
     * @argument privilege New value
     * @returns User
     * @throws GraphQLError if not STAFF or is on hold
     */
    setPrivilege: async (
      _parent: any,
      args: { userID: string; privilege: Privilege },
      { isManager }: ApolloContext
    ) =>
      isManager(async (executingUser: any) => {
        const userSubject = await UserRepo.setPrivilege(Number(args.userID), args.privilege);

        await createLog(
          `{user} set {user}'s access level to ${args.privilege}.`,
          "admin",
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: userSubject.id, label: getUsersFullName(userSubject) }
        );
      }),

    /**
     * Set a User as Archived
     * @argument userID ID of User to modify
     * @returns User
     * @throws GraphQLError if not STAFF or is on hold 
     */
    archiveUser: async (
      _parent: any,
      args: { userID: string },
      { isManager }: ApolloContext
    ) =>
      isManager(
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
