import { knex } from "../../db";
import { logsToDomain } from "../../mappers/auditLogs/auditLogMapper";
import { AuditLog } from "../../schemas/auditLogsSchema";

export async function createLog(
  message: string,
  ...entities: { id: number; label: string }[]
) {
  let formattedMessage = message;

  // "{user} reserved {equipment}" -> "<user:3:Matt> reserved <equipment:12:Table Saw>"
  entities.forEach(({ id, label }) => {
    const entityType = message.match(/{(\w+)}/)?.[1];
    formattedMessage = formattedMessage.replace(
      /{\w+}/,
      `<${entityType}:${id}:${label}>`
    );
  });

  await knex("AuditLogs").insert({ message: formattedMessage });
}

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
