/** AnnouncementsRepository.ts
 * DB operations endpoint for Announcements table
 */

import { EntityNotFound } from "../../EntityNotFound";
import { knex } from "../../db";
import { AnnouncementRow } from "../../db/tables";

/**
 * fetch every Announcement
 * @returns array of AnnouncementRow
 */
export async function getAnnouncements() {
  return knex('Announcements');
}

/**
 * 
 * @param announcementID the unique ID of the announcement to retrieve
 * @returns AnnouncementRow the Announcment at requested ID
 * @throws EntityNotFound on nonexistent ID
 */
export async function getAnnouncementByID(announcementID: number): Promise<AnnouncementRow> {
  const announcement = await knex("Announcements").first().where("id", announcementID);
  if (!announcement) throw new EntityNotFound(`Announcement #${announcementID} not found`);

  return announcement;
}

/**
 * Create an announcement and append it to the table
 * @param announcement title and description of the announcment
 * @returns AnnouncementRow complete object with ID
 */
export async function createAnnouncement(announcement: {
  title: string;
  description: string;
}): Promise<AnnouncementRow> {
  const [newID] = await knex("Announcements").insert(announcement, "id");
  return await getAnnouncementByID(newID);
}

/**
 * Update the Title and Description of the Announcment at ID
 * @param announcement existing id, updated title, and updated description of the announcment
 * @returns AnnouncmentRow updated Announcement
 */
export async function updateAnnouncement(announcement: {
  id: number
  title: string;
  description: string;
}): Promise<AnnouncementRow> {
  await knex("Announcements").where({ id: announcement.id}).update({ title: announcement.title, description: announcement.description})
  return getAnnouncementByID(announcement.id)
}

/**
 * Delete from the table the Announcement at ID
 * @param id the unique ID of the Announcment to delete
 * @returns boolean true
 */
export async function deleteAnnouncement(id: number): Promise<boolean>{
  await knex("Announcements").where({ id: id}).delete()
  return true
}
