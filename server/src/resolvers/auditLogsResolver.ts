import * as AuditLogRepo from "../repositories/AuditLogs/AuditLogRepository";
import { Privilege } from "../schemas/usersSchema";
import { ApolloContext } from "../context";

const AuditLogResolvers = {
  Query: {
    auditLogs: async (
      parent: any,
      args: { startDate: string; stopDate: string; searchText: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.LABBIE, Privilege.ADMIN], async () => {
        const startDate = args.startDate ?? "2020-01-01";
        const stopDate = args.stopDate ?? "2200-01-01";
        const searchText = args.searchText ?? "";

        return await AuditLogRepo.getLogs(startDate, stopDate, searchText);
      }),
  },
};

export default AuditLogResolvers;
