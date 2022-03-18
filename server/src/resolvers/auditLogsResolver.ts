import * as AuditLogRepo from "../repositories/AuditLogs/AuditLogRepository";
import { ApolloContext } from "../server";
import { Privilege } from "../schemas/usersSchema";

const AuditLogResolvers = {
  Query: {
    auditLogs: async (
      parent: any,
      args: { startDate: string; stopDate: string; searchText: string },
      context: ApolloContext
    ) => {
      if (!context.userHasPrivilege(Privilege.LABBIE, Privilege.ADMIN)) {
        return null;
      }

      const startDate = args.startDate ?? "2020-01-01";
      const stopDate = args.stopDate ?? "2200-01-01";

      return await AuditLogRepo.getLogs(startDate, stopDate, args.searchText);
    },
  },
};

export default AuditLogResolvers;
