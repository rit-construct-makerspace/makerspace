import { EntityNotFound } from "../../EntityNotFound";
import { knex } from "../../db";
import { AnnouncementRow } from "../../db/tables";

export async function getAnnouncements() {
  return knex('Announcements');
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

export async function updateAnnouncement(announcement: {
  id: number
  title: string;
  description: string;
}): Promise<AnnouncementRow> {
  await knex("Announcements").where({ id: announcement.id}).update({ title: announcement.title, description: announcement.description})
  return getAnnouncementByID(announcement.id)
}

export async function deleteAnnouncement(id: number): Promise<boolean>{
  await knex("Announcements").where({ id: id}).delete()
  return true
}