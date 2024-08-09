/** AuditLogRepository.ts
 * DB operations endpoint for AuditLog table
 */

import { knex } from "../../db/index.js";
import { logsToDomain } from "../../mappers/auditLogs/auditLogMapper.js";
import { AuditLog } from "../../schemas/auditLogsSchema.js";

/**
 * Create an AuditLog and append it to the table
 * @param message String verb description of the Log entry (i.e. reserved, deleted)
 * @param entities items involved in log {id, label}
 */
export async function createLog(
  message: string,
  ...entities: { id: any; label: string }[]
) {
  let formattedMessage = message;

  // "{user} reserved {equipment}" -> "<user:3:Matt> reserved <equipment:12:Table Saw>"
  entities.forEach(({ id, label }) => {
    const entityType = formattedMessage.match(/{(\w+)}/)?.[1];
    formattedMessage = formattedMessage.replace(
      /{\w+}/,
      `<${entityType}:${id}:${label}>`
    );
  });

  await knex("AuditLogs").insert({ message: formattedMessage });
}

/**
 * Create an AuditLog and append it to the table
 * @param message String verb description of the Log entry (i.e. reserved, deleted)
 * @param array of entities items involved in log {id, label}
 */
export async function createLogWithArray(
  message: string,
  entities: { id: any; label: string }[]
) {
  let formattedMessage = message;

  // "{user} reserved {equipment}" -> "<user:3:Matt> reserved <equipment:12:Table Saw>"
  entities.forEach(({ id, label }) => {
    const entityType = formattedMessage.match(/{(\w+)}/)?.[1];
    formattedMessage = formattedMessage.replace(
      /{\w+}/,
      `<${entityType}:${id}:${label}>`
    );
  });

  await knex("AuditLogs").insert({ message: formattedMessage });
}

/**
 * Fetch logs by filtered criteria
 * @param startDate earliest date to filter by
 * @param stopDate latest date to filter by
 * @param searchText text to filter by
 * @returns 
 */
export async function getLogs(
  startDate: string,
  stopDate: string,
  searchText: string
): Promise<AuditLog[]> {
  const knexResult = await knex("AuditLogs")
    .select()
    .whereBetween("dateTime", [startDate, stopDate])
    .where("message", "ilike", `%${searchText}%`)
    .orderBy("dateTime", "DESC");

  return logsToDomain(knexResult);
}
