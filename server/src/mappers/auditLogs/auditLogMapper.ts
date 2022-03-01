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
            userID: raw.userID,
            eventType: raw.eventType,
            description: raw.description
        }
        return value;
    }

    export function logsToDomainByDate(raw: any, startDate: Date, endDate: Date): AuditLogs[] {
        const result = raw.map((i: any) => {
            if (i.timeDate <= endDate && i.timeDate >= startDate) {
                return singleLogToDomain(i);
            }
        })
        return result;
    }