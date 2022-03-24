import { AuditLog } from "../../schemas/auditLogsSchema";

export function logsToDomain(raw: any): AuditLog[] {
  return raw.map((i: any) => {
    return singleLogToDomain(i);
  });
}

export function singleLogToDomain(raw: any): AuditLog | null {
  if (!raw) return null;

  return {
    id: raw.id,
    dateTime: raw.dateTime,
    message: raw.message,
  };
}
