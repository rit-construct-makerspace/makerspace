import { Privilege } from "./schemas/usersSchema";
import { UserRow } from "./db/tables";
import { GraphQLError } from "graphql/error/GraphQLError";

export interface CurrentUser extends UserRow {
  hasHolds: boolean;
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
    targetedUserID: string,
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
  (targetedUserID: string, allowedPrivileges: Privilege[], callback: (user: CurrentUser) => any) => {
    if (!expressUser) {
      throw new AuthenticationError("Unauthenticated - ifallowedorself");
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
