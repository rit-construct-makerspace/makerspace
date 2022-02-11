import {AuditLogs} from "../../models/auditLogs/auditLogs";
import { knex } from "../../db";
import {singleLogToDomain, logsToDomain} from "../../mappers/auditLogs/auditLogMapper"

export interface IAuditLogRepo {
    getLogByID(logID: number): Promise<AuditLogs | null>;
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

    public async getLogs(): Promise<AuditLogs[]> {
        const knexResult = await this.queryBuilder("InventoryItem").select(
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