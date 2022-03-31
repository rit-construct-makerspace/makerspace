import { Privilege } from "./schemas/usersSchema";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { UserRow } from "./db/tables";

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
}

const ifAllowed =
  (expressUser: Express.User | undefined) =>
  (allowedPrivileges: Privilege[], callback: (user: CurrentUser) => any) => {
    if (!expressUser) {
      throw new AuthenticationError("Unauthenticated");
    }

    const user = expressUser as CurrentUser;

    const sufficientPrivilege = allowedPrivileges.includes(user.privilege);
    if (!sufficientPrivilege) {
      throw new ForbiddenError("Insufficient privilege");
    }

    if (user.hasHolds) {
      throw new ForbiddenError("User has outstanding account holds");
    }

    return callback(user);
  };

const context = ({ req }: { req: any }) => ({
  user: req.user,
  logout: () => req.logout(),
  ifAllowed: ifAllowed(req.user),
});

export default context;
