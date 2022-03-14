import {EventType} from "./eventTypes";

export interface AuditLogsInput {
    userID: number;
    eventType: EventType;
    description: string;
}