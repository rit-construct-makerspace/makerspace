import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository";
import * as UsersRepo from "../repositories/Users/UserRepository";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import { HoldRow } from "../db/tables";

const HoldsResolvers = {
  User: {
    holds: async (parent: { id: string }) =>
      HoldsRepo.getHoldsByUser(parent.id),
  },

  Hold: {
    creator: async (
      parent: HoldRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async () => {
        return UsersRepo.getUserByID(parent.creatorID);
      }),

    remover: async (
      parent: HoldRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.LABBIE, Privilege.ADMIN],
        async () => parent.removerID && UsersRepo.getUserByID(parent.removerID)
      ),
  },

  Mutation: {
    createHold: async (
      _parent: any,
      args: { userID: string; description: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async (user) => {
        const userWithHold = await UsersRepo.getUserByID(args.userID);

        await createLog(
          "{user} placed a hold on {user}'s account.",
          { id: user.id, label: getUsersFullName(user) },
          { id: args.userID, label: getUsersFullName(userWithHold) }
        );

        return HoldsRepo.createHold(user.id, args.userID, args.description);
      }),

    removeHold: async (
      _parent: any,
      args: { holdID: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async (user) => {
        const hold = await HoldsRepo.getHold(args.holdID);
        const userWithHold = await UsersRepo.getUserByID(hold.userID);

        await createLog(
          "{user} removed a hold on {user}'s account.",
          { id: user.id, label: getUsersFullName(user) },
          { id: userWithHold.id, label: getUsersFullName(userWithHold) }
        );

        return HoldsRepo.removeHold(args.holdID, user.id);
      }),
  },
};

export default HoldsResolvers;
