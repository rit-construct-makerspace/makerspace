import { knex } from "../../db";

export function getAnnouncements() {
  return knex('Announcements').select()
  .whereRaw('"expDate" > CURRENT_TIMESTAMP');
}