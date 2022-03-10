import {AuditLogRepo} from "../repositories/AuditLogs/AuditLogRepository";

const alr = new AuditLogRepo();

const AuditLogResolvers = {
    Query: {
        auditLogs: async (_: any, args: any, context: any) => {
            try {
                return await alr.getLogs();
            } catch (e) {
                console.log("Error:", e);
            }
        },
        auditLog: async (_: any, args: any, context: any) => {
            try {
                return await alr.getLogByID(args.id);
            } catch (e) {
                console.log("Error:", e);
            }
        },
        auditLogsByUser: async (_: any, args: any, context: any) => {
            try {
                return await alr.getLogsByUser(args.userID);
            } catch (e) {
                console.log("Error:", e);
            }
        },
        auditLogsByEventType: async (_: any, args: any, context: any) => {
            try {
                return await alr.getLogsByEventType(args.eventType);
            } catch (e) {
                console.log("Error:", e);
            }
        },
        auditLogsByDate: async (_: any, args: any, context: any) => {
            try {
                return await alr.getLogsByDate(args.startDate, args.endDate);
            } catch (e) {
                console.log("Error:", e);
            }
        },
    },

    Mutation: {

        addLog: async (_: any, args: any) => {
            try {
                return await alr.addLog(args.log);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        modifyLogDescription: async (_: any, args: any) => {
            try {
                return await alr.modifyLogDescription(args.logID, args.description);
            } catch (e) {
                console.log("Error:", e);
            }
        },

        deleteLog: async (_: any, args: any) => {
            try {
                return await alr.deleteLog(args.logID);
            } catch (e) {
                console.log("Error:", e);
            }
        },

    },
};

export default AuditLogResolvers;
