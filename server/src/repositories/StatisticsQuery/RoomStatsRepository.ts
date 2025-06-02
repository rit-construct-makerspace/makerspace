/**
 * RoomStatsRepository.ts
 * DB Operations for room-related statistical queries
 */

import { knex } from "../../db/index.js";

export interface VerboseRoomSwipe {
  id: number;
  dateTime: number;
  roomID: number;
  userID: number;
  roomName: string;
  userName: string;
}

export async function getRoomSwipesWithAttachedEntities(startDate?: string, endDate?: string): Promise<{rows: VerboseRoomSwipe[]}> {
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

  return await knex.raw(`
    SELECT rs.*, r.name AS "roomName", concat(substr(u."firstName", 0, 2), '. ', u."lastName") AS "userName"
    FROM "RoomSwipes" rs 
    INNER JOIN "Rooms" r ON rs."roomID" = r.id
    INNER JOIN "Users" u ON rs."userID" = u.id
    ${numWhereCaluses > 0 ? " WHERE " : ""}
    ${startDateSearchString}
    ${endDateSearchString.length > 0 ? " AND " : ""}
    ${endDateSearchString}
    ORDER BY rs."dateTime" DESC 
  `);
}