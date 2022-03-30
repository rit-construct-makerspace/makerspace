import { Privilege, User } from "./schemas/usersSchema";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";

export interface ApolloContext {
  user: User | undefined;
  logout: () => void;
  ifAllowed: (
    allowedPrivileges: Privilege[],
    callback: (user: User) => any
  ) => any;
}

const ifAllowed =
  (expressUser: Express.User | undefined) =>
  (allowedPrivileges: Privilege[], callback: (user: User) => any) => {
    if (!expressUser) {
      throw new AuthenticationError("Unauthenticated");
    }

    const user = expressUser as User;

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
