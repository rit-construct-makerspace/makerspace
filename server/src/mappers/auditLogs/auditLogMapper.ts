import { AuditLogs } from "../../models/auditLogs/auditLogs";

    export function logsToDomain(raw: any): AuditLogs[] {
        const result = raw.map((i: any) => {
            return singleLogToDomain(i);
        })
        return result;
    }

    export function singleLogToDomain(raw: any): AuditLogs | null {
        if (raw === undefined || raw === null) return null;
        const value: AuditLogs = {
            id: raw.id,
            timeDate: raw.timeDate,
            user: raw.user,
            eventType: raw.eventType,
            description: raw.description
        }
        return value;
    }