import { knex } from "../../db";
import {
  logsToDomain,
  singleLogToDomain,
} from "../../mappers/auditLogs/auditLogMapper";
import { AuditLog } from "../../schemas/auditLogsSchema";

export async function createLog(message: string): Promise<AuditLog | null> {
  const result = await knex("AuditLogs").insert({ message }, "id");
  const newLogID = result[0];
  const newLog = await knex("AuditLogs").select().where("id", newLogID);
  return singleLogToDomain(newLog);
}

export async function getLogs(
  startDate: string,
  stopDate: string,
  searchText: string
): Promise<AuditLog[]> {
  const knexResult = await knex("AuditLogs")
    .select()
    .whereBetween("dateTime", startDate, stopDate)
    .andWhereLike("message", `%${searchText}%`);

  return logsToDomain(knexResult);
}
