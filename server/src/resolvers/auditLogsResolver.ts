import {AuditLogs} from "../models/auditLogs/auditLogs";
import {AuditLogRepo} from "../repositories/AuditLogs/AuditLogRepository";

const AuditLogResolvers = {
    Query: {
        auditLogs: async (_: any, args: any, context: any) => {
            try {
                const alr = new AuditLogRepo();
                return await alr.getLogs();
            } catch (e) {
                console.log("Error:", e);
            }
        },
    },

    Mutation: {

        addLog: async (_: any, args: any) => {
            try {
                const alr = new AuditLogRepo();
                return await alr.addLog(args);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        modifyLogDescription: async (_: any, args: any) => {
            try {
                const alr = new AuditLogRepo();
                return await alr.modifyLogDescription(args);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        deleteLog: async (_: any, args: any) => {
            try {
                const alr = new AuditLogRepo();
                return await alr.deleteLog(args);
            } catch (e) {
                console.log("Error:", e);
            }
        },

    },
};

export default AuditLogResolvers;
