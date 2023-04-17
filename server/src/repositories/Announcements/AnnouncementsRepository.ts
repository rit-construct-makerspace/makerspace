import { EntityNotFound } from "../../EntityNotFound";
import { knex } from "../../db";
import { AnnouncementRow } from "../../db/tables";

export function getAnnouncements() {
  return knex('Announcements').select()
  .whereRaw('"expDate" > CURRENT_TIMESTAMP');
}

export async function getAnnouncementByID(announcementID: number): Promise<AnnouncementRow> {
  const announcement = await knex("Announcements").first().where("id", announcementID);
  
  if (!announcement) throw new EntityNotFound(`Announcement #${announcementID} not found`);

  return announcement;
}

export async function createAnnouncement(announcement: {
  title: string;
  description: string;
}): Promise<AnnouncementRow> {
  const [newID] = await knex("Announcements").insert(announcement, "id");
  return await getAnnouncementByID(newID);
}