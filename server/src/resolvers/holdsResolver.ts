import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository.js";
import * as UsersRepo from "../repositories/Users/UserRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { HoldRow } from "../db/tables.js";

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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
        const userWithHold = await UsersRepo.getUserByID(Number(args.userID));

        await createLog(
          "{user} placed a hold on {user}'s account.",
          "admin",
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
        const hold = await HoldsRepo.getHold(Number(args.holdID));
        const userWithHold = await UsersRepo.getUserByID(hold.userID);

        await createLog(
          "{user} removed a hold on {user}'s account.",
          "admin",
          { id: user.id, label: getUsersFullName(user) },
          { id: userWithHold.id, label: getUsersFullName(userWithHold) }
        );

        return HoldsRepo.removeHold(Number(args.holdID), user.id);
      }),
  },
};

export default HoldsResolvers;
