import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository";
import * as UsersRepo from "../repositories/Users/UserRepository";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import { HoldRow } from "../db/tables";

const HoldsResolvers = {
  Hold: {
    creator: async (
      parent: HoldRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return UsersRepo.getUserByID(parent.creatorID);
      }),

    remover: async (
      parent: HoldRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.removerID && UsersRepo.getUserByID(parent.removerID)
      ),
  },

  Mutation: {
    createHold: async (
      _parent: any,
      args: { userID: string; description: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const userWithHold = await UsersRepo.getUserByID(Number(args.userID));

        await createLog(
          "{user} placed a hold on {user}'s account.",
          { id: user.id, label: getUsersFullName(user) },
          { id: Number(args.userID), label: getUsersFullName(userWithHold) }
        );

        return HoldsRepo.createHold(user.id, Number(args.userID), args.description);
      }),

    removeHold: async (
      _parent: any,
      args: { holdID: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const hold = await HoldsRepo.getHold(Number(args.holdID));
        const userWithHold = await UsersRepo.getUserByID(hold.userID);

        await createLog(
          "{user} removed a hold on {user}'s account.",
          { id: user.id, label: getUsersFullName(user) },
          { id: userWithHold.id, label: getUsersFullName(userWithHold) }
        );

        return HoldsRepo.removeHold(Number(args.holdID), user.id);
      }),
  },
};

export default HoldsResolvers;
