/** RoomRepository.ts
 * DB operations endpoint for Rooms table
 */

import { Room } from "../../models/rooms/room";
import { knex } from "../../db";
import {
  roomsToDomain,
  singleRoomToDomain,
} from "../../mappers/rooms/roomMapper";
import assert from "assert";
import { RoomSwipeRow } from "../../db/tables";
import { EntityNotFound } from "../../EntityNotFound";


/**
 * Fetch a room by it's ID
 * @param roomID the unique ID of the Room entry
 * @returns the specified room
 */
export async function getRoomByID(roomID: number): Promise<Room | null> {
  const knexResult = await knex
    .first("id", "name")
    .from("Rooms")
    .where("id", roomID);

  return singleRoomToDomain(knexResult);
}

/**
 * Fetch all rooms in the table
 * @returns {Room[]} rooms
 */
export async function getRooms(): Promise<Room[]> {
  const knexResult = await knex("Rooms").select("Rooms.id", "Rooms.name");
  return roomsToDomain(knexResult);
}

/**
 * Create and append a room to the table
 * @param room the proposed room entry
 * @returns the added room
 */
export async function addRoom(room: Room): Promise<Room> {
  const newID = (
    await knex("Rooms").insert(
      {
        name: room.name,
      },
      "id"
    )
  )[0];
  const newRoom = await getRoomByID(newID);
  assert(newRoom);
  return newRoom;
}


/**
 * Mark a room as ARCHIVED
 * @param roomID the ID of the room to archive
 * @returns the updated room
 * @throws EntityNotFound on nonexisting ID
 */
export async function archiveRoom(roomID: number): Promise<Room | null> {
  const updatedRooms: Room[] = await knex("Rooms").where({ id: roomID }).update({ archived: true }).returning("*");

  if (updatedRooms.length < 1) throw new EntityNotFound(`Could not find room #${roomID}`);

  return updatedRooms[0];
}

/**
 * Update the name of an existing room
 * @param roomID the ID of the room to update
 * @param name the updated name
 * @returns the updated room
 */
export async function updateRoomName(
  roomID: number,
  name: string
): Promise<Room | null> {
  await knex("Rooms").where({ id: roomID }).update({
    name: name,
  });

  return await getRoomByID(roomID);
}

/**
 * Log a successful room access swipe
 * @param roomID the room accessed
 * @param userID the user who accessed the room
 */
export async function swipeIntoRoom(roomID: number, userID: number) {
  await knex("RoomSwipes").insert({ roomID, userID });
}

/**
 * Fetch the last 10 swipe logs to a specified room
 * @param roomID the room to filter by
 * @returns the past 10 room swipes
 */
export async function getRecentSwipes(roomID: number): Promise<RoomSwipeRow[]> {
  return knex("RoomSwipes")
    .select()
    .where({ roomID })
    .orderBy("dateTime", "DESC")
    .limit(10);
}
