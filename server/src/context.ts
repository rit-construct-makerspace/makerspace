import { Privilege } from "./schemas/usersSchema.js";
import { UserRow } from "./db/tables.js";
import { GraphQLError } from "graphql/error/GraphQLError.js";
import { knex } from "./db/index.js";

export interface CurrentUser extends UserRow {
  hasHolds: boolean;
  hasCardTag: boolean;
}

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

export const ifAllowed =
  (expressUser: Express.User | undefined) =>
  (allowedPrivileges: Privilege[], callback: (user: CurrentUser) => any) => {
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
    if (!expressUser) {
      throw new GraphQLError("Unauthenticated");
    }

    const user = expressUser as CurrentUser;

    return callback(user);
  };

const context = async ({ req }: { req: any }) => ({
  user: req.user,
  logout: () => req.logout(),
  ifAllowed: ifAllowed(req.user),
  ifAllowedOrSelf: ifAllowedOrSelf(req.user),
  ifAuthenticated: ifAuthenticated(req.user)
});

export default context;
