import { Privilege } from "./schemas/usersSchema.js";
import { UserRow } from "./db/tables.js";
import { GraphQLError } from "graphql/error/GraphQLError.js";
import { knex } from "./db/index.js";

export interface CurrentUser extends UserRow {
  hasHolds: boolean;
  hasCardTag: boolean;
  manager: number[];
  staff: number[];
  trainer: number[];
}

const testuser: CurrentUser = {
  id: 16,
  firstName: "Test",
  lastName: "User",
  pronouns: "They / Them",
  isStudent: true,
  privilege: Privilege.STAFF,
  registrationDate: new Date(),
  expectedGraduation: "June 2077",
  college: "GCCIS",
  setupComplete: true,
  ritUsername: "tu1000",
  archived: false,
  balance: "0",
  manager: [],
  staff: [],
  trainer: [],
  cardTagID: "12345",
  notes: "",
  activeHold: false,
  admin: true,
  hasHolds: false,
  hasCardTag: true,
};

export interface ApolloContext {
  user: CurrentUser | undefined;
  logout: () => void;
  ifAllowed: (
    allowedPrivileges: Privilege[],
    callback: (user: CurrentUser) => any
  ) => any;
  ifAuthenticated: (callback: (user: CurrentUser) => any) => any;
  ifAllowedOrSelf: (
    targetedUserID: number,
    allowedPrivileges: Privilege[],
    callback: (user: CurrentUser) => any
  ) => any;
}

function authenticated(expressUser: Express.User | undefined) {
  if (process.env.USE_TEST_DEV_USER_DANGER != "TRUE" && !expressUser) {
    throw new GraphQLError("Unauthenticated");
  } 
}

export const ifAdmin =
  (expressUser: Express.User | undefined) =>
  (callback: (user: CurrentUser) => any) => {
    authenticated(expressUser);
    const user = expressUser as CurrentUser;

    if (!user.admin) {
      throw new GraphQLError("Insufficent Privilege | Admin Only")
    }

    return callback(process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? user : testuser);
  }

export const ifManager =
  (expressUser: Express.User | undefined) =>
  (makerspaceID: number, callback: (user: CurrentUser) => any) => {
    authenticated(expressUser);
    const user = expressUser as CurrentUser;

    if (!user.manager.includes(makerspaceID) || user.admin) {
      throw new GraphQLError(`Insufficent Priviledge | Not Manager of Makerspace ${makerspaceID}`);
    }

    return callback(process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? user : testuser);
  }

export const ifStaff =
  (expressUser: Express.User | undefined) =>
  (makerspaceID: number, callback: (user: CurrentUser) => any) => {
    authenticated(expressUser);
    const user = expressUser as CurrentUser;
    if (!user.staff.includes(makerspaceID) || !user.manager.includes(makerspaceID) || !user.admin) {
      throw new GraphQLError(`Insufficent Priviledge | Not Staff of Makersapce ${makerspaceID}`);
    }

    return callback(process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? user : testuser);
  }

export const ifTrainer = 
  (expressUser: Express.User | undefined) =>
  (equipmentID: number, callback: (user: CurrentUser) => any) => {
    authenticated(expressUser);
    const user = expressUser as CurrentUser;

    if (!user.trainer.includes(equipmentID) || !user.admin) {
      throw new GraphQLError(`Insufficent Priviledge | Not Trainer for Equipment ${equipmentID}`);
    }

    return callback(process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? user : testuser);
  }

export const ifAllowed =
  (expressUser: Express.User | undefined) =>
  (allowedPrivileges: Privilege[], callback: (user: CurrentUser) => any) => {
    if (process.env.USE_TEST_DEV_USER_DANGER == "TRUE") expressUser = testuser;
    if (!expressUser) {
      throw new GraphQLError("Unauthenticated");
    }

    const user = expressUser as CurrentUser;

    const sufficientPrivilege = allowedPrivileges.includes(user.privilege);
    if (!sufficientPrivilege) {
      throw new GraphQLError("Insufficient privilege");
    }

    if (user.hasHolds) {
      throw new GraphQLError("User has outstanding account holds");
    }

    return callback(user);
  };

export const ifAllowedOrSelf =
  (expressUser: Express.User | undefined) =>
  (targetedUserID: number, allowedPrivileges: Privilege[], callback: (user: CurrentUser) => any) => {
    if (process.env.USE_TEST_DEV_USER_DANGER == "TRUE") expressUser = testuser;
    if (!expressUser) {
      throw new GraphQLError("Unauthenticated - ifallowedorself");
    }

    const user = expressUser as CurrentUser;

    if (user.id === targetedUserID) {
      return callback(user);
    }
    else {
      return ifAllowed(expressUser)(allowedPrivileges, callback);
    }
  };

// only checks if user is authenticated (for actions where holds or privileges do not matter)
export const ifAuthenticated =
  (expressUser: Express.User | undefined) =>
  (callback: (user: CurrentUser) => any) => {
    if (process.env.USE_TEST_DEV_USER_DANGER != "TRUE" && !expressUser) {
      throw new GraphQLError("Unauthenticated");
    }

    const user = expressUser as CurrentUser;
    return callback(process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? user : testuser);
  };

const context = async ({ req }: { req: any }) => ({
  user: process.env.USE_TEST_DEV_USER_DANGER != "TRUE" ? req.user : testuser,
  logout: () => req.logout(),
  ifAllowed: ifAllowed(req.user),
  ifAllowedOrSelf: ifAllowedOrSelf(req.user),
  ifAuthenticated: ifAuthenticated(req.user)
});

export default context;