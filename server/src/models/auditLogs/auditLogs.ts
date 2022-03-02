import {EventType} from "./eventTypes";

export interface AuditLogs {
    id: number;
    timeDate: Date ;
    userID: number;
    eventType: EventType;
    description: string;
}