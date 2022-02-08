import {AuditLogRepo} from "../../repositories/AuditLogs/AuditLogRepository";
import {AggregateRoot} from "../AggregateRoot";
import {EventType} from "./eventTypes";


export class AuditLogs extends AggregateRoot {
    id: number | undefined;
    timeDate: Date | undefined;
    user: string | undefined;
    eventType: EventType | undefined
    description: string | undefined

    public constructor(timeDate: Date, user: string, eventType: EventType, description: string, id?: number) {
        super();
        this.id = id;
        this.timeDate = timeDate;
        this.user = user;
        this.eventType = eventType;
        this.description = description;
    }
}