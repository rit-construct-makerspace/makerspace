import {AuditLogs} from "../../models/auditLogs/auditLogs";

export interface IAuditLogRepo {
    getLogById(logID: number): Promise<AuditLogs>;
    getLogs(): Promise<AuditLogs[]>;
    addLogs(auditLog: AuditLogs): Promise<AuditLogs>;
}
export  class  AuditLogRepo {

    getLogByID(LogID: number): Promise<AuditLogs> {
        throw new Error("Method not implemented.");
    }

    getLogs(): Promise<AuditLogs[]> {
        throw new Error("Method not implemented.");
    }

    addLog(args: any) {
        throw new Error("Method not implemented.");
    }
    modifyLogDescription(args: any) {
        throw new Error("Method not implemented.");
    }

    deleteLog(args: any) {
        throw new Error("Method not implemented.");
    }
}