import {AuditLogs} from "../../models/auditLogs/auditLogs";
import {EventType} from "../../models/auditLogs/eventTypes";
import { knex } from "../../db";
import {singleLogToDomain, logsToDomain, logsToDomainByDate} from "../../mappers/auditLogs/auditLogMapper";

export interface IAuditLogRepo {
    getLogByID(logID: number): Promise<AuditLogs | null>;
    getLogsByEventType(eventType: EventType): Promise<AuditLogs[]>;
    getLogsByUser(args: any): Promise<AuditLogs[]>;
    getLogsByDate(startDate: Date, endDate: Date): Promise<AuditLogs[]>
    getLogs(): Promise<AuditLogs[]>;
    addLog(log: AuditLogs): Promise<AuditLogs | null>;
    modifyLogDescription(logID: number, description: string): Promise<AuditLogs | null>;
    deleteLog(logID: number): Promise<void>;
}
export  class  AuditLogRepo implements IAuditLogRepo {

    private queryBuilder;

    constructor(queryBuilder?: any) {
        this.queryBuilder = queryBuilder || knex;
    }

    public async getLogByID(logID: number): Promise<AuditLogs | null> {
        const knexResult = await this.queryBuilder
            .first(
                "id",
                "timeDate",
                "user",
                "eventType",
                "description"
            )
            .from("AuditLogs")
            .where("id", logID);

        return singleLogToDomain(knexResult);
    }

    public async getLogsByEventType(eventType: EventType): Promise<AuditLogs[]> {
        const knexResult = await this.queryBuilder
            .first(
                "id",
                "timeDate",
                "user",
                "eventType",
                "description"
            )
            .from("AuditLogs")
            .where("eventType", eventType);

        return logsToDomain(knexResult);
    }

    //Waiting on User model to be implemented to update params
    public async getLogsByUser(args: any): Promise<AuditLogs[]> {
        const knexResult = await this.queryBuilder
            .first(
                "id",
                "timeDate",
                "user",
                "eventType",
                "description"
            )
            .from("AuditLogs")
            .where("user", args);

        return logsToDomain(knexResult);
    }

    public async getLogsByDate(startDate: Date, endDate: Date): Promise<AuditLogs[]> {
        const knexResult = await this.queryBuilder("AuditLogs").select(
            "AuditLogs.id",
            "AuditLogs.timeDate",
            "AuditLogs.user",
            "AuditLogs.eventType",
            "AuditLogs.description"
        );
        return logsToDomainByDate(knexResult, startDate, endDate);
    }

    public async getLogs(): Promise<AuditLogs[]> {
        const knexResult = await this.queryBuilder("AuditLogs").select(
            "AuditLogs.id",
            "AuditLogs.timeDate",
            "AuditLogs.user",
            "AuditLogs.eventType",
            "AuditLogs.description"
        );
        return logsToDomain(knexResult);
    }

    public async addLog(log: AuditLogs): Promise<AuditLogs | null> {
        const newID = (
            await this.queryBuilder("AuditLogs").insert(
                {
                    timeDate: log.timeDate,
                    user: log.user,
                    eventType: log.eventType,
                    description: log.description,
                },
                "id"
            )
        )[0];
        return await this.getLogByID(newID);
    }

    public async modifyLogDescription(logID: number, description: string): Promise<AuditLogs | null> {
        const updateDesc = await this.queryBuilder("AuditLogs")
            .where({ id: logID })
            .update({
                description: description
            });

        return await this.getLogByID(logID);
    }

    public async deleteLog(logID: number): Promise<void> {
        await this.queryBuilder("AuditLogs").where({ id: logID }).del();
    }
}