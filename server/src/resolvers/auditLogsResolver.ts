import * as AuditLogRepo from "../repositories/AuditLogs/AuditLogRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";

const AuditLogResolvers = {
  Query: {
    auditLogs: async (
      parent: any,
      args: { startDate: string; stopDate: string; searchText: string, filters?: AuditLogRepo.Filters },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        const startDate = args.startDate ?? "2020-01-01";
        const stopDate = args.stopDate ?? "2200-01-01";
        const searchText = args.searchText ?? "";

        return await AuditLogRepo.getLogs(startDate, stopDate, searchText, args.filters);
      }),
  },
};

export default AuditLogResolvers;
