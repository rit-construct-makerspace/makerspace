import {EventType} from "./eventTypes";

export interface AuditLogs {
    id: number;
    timeDate: Date ;
    user: string;
    eventType: EventType;
    description: string;
}