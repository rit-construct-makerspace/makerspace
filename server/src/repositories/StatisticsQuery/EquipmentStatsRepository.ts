/**
 * EquipmentStatsRepository.ts
 * DB Operations for equipment-related statistical queries
 */

import moment from "moment";
import { knex } from "../../db/index.js";
moment().format(); 


export interface VerboseEquipmentSession {
  id: number;
  start: Date;
  equipmentID: number;
  userID: number;
  userName: string; //First Initial + '. ' + Last Name
  sessionLength: number;
  readerSlug: string;
  equipmentName: string;
  roomID: number;
  roomName: string;
  zoneID: number;
  zoneName: string;
}

export async function getEquipmentSessionsWithAttachedEntities(startDate?: string, endDate?: string, equipmentIDs?: number[]): Promise<{rows: VerboseEquipmentSession[]}> {
  var numWhereCaluses = 0;
  var startDateSearchString = "";
  if (startDate) {
    numWhereCaluses++;
    //To prevent SQL Injection, Make sure JS sees it as a Date
    if (!isNaN(new Date(startDate).getDate())) startDateSearchString = `ms."submissionDate" >= '${startDate}'`;
  }

  var endDateSearchString = "";
  if (endDate) {
    numWhereCaluses++;
    //To prevent SQL Injection, Make sure JS sees it as a Date
    if (!isNaN(new Date(endDate).getDate())) endDateSearchString = `ms."submissionDate" < '${endDate}'`;
  }

  var equipmentSearchString = "";
  if (equipmentIDs && equipmentIDs.length > 0) {
    numWhereCaluses++;
    equipmentSearchString = `WHERE tm.id = ANY(ARRAY ${equipmentIDs})`;
  }

  return await knex.raw(`
    SELECT es.*, concat(substr(u."firstName", 0, 2), '. ', u."lastName") AS "userName", e."name" AS "equipmentName", r.id AS "roomID", r."name" AS "roomName", z.id AS "zoneID", z."name" AS "zoneName"
    FROM "EquipmentSessions" es 
    INNER JOIN "Users" u ON es."userID" = u.id
    INNER JOIN "Equipment" e ON es."equipmentID" = e.id
    INNER JOIN "Rooms" r ON e."roomID" = r.id
    INNER JOIN "Zones" z ON r."zoneID" = z.id
    WHERE es."sessionLength" != 0
    ${numWhereCaluses > 0 ? "AND WHERE " : ""}
    ${startDateSearchString}
    ${endDateSearchString.length > 0 ? " AND " : ""}
    ${endDateSearchString}
    ${equipmentSearchString.length > 0 ? " AND " : ""}
    ${equipmentSearchString}
    ORDER BY es."start" DESC
`);
}