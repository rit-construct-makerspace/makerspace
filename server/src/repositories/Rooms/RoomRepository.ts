import { Room } from "../../models/rooms/room";
import { knex } from "../../db";
import {
  roomsToDomain,
  singleRoomToDomain,
} from "../../mappers/rooms/roomMapper";
import assert from "assert";
import { RoomSwipeRow } from "../../db/tables";
import { EntityNotFound } from "../../EntityNotFound";

export async function getRoomByID(roomID: number): Promise<Room | null> {
  const knexResult = await knex
    .first("id", "name", "pictureURL")
    .from("Rooms")
    .where("id", roomID);

  console.log(knexResult)
  return singleRoomToDomain(knexResult);
}

export async function getRooms(): Promise<Room[]> {
  const knexResult = await knex("Rooms").select("Rooms.id", "Rooms.name", "Rooms.pictureURL");
  return roomsToDomain(knexResult);
}

export async function addRoom(room: Room): Promise<Room> {
  const newID = (
    await knex("Rooms").insert(
      {
        name: room.name,
        pictureURL: room.pictureURL
      },
      "id"
    )
  )[0];
  const newRoom = await getRoomByID(newID);
  assert(newRoom);
  return newRoom;
}

export async function archiveRoom(roomID: number): Promise<Room | null> {
  const updatedRooms: Room[] = await knex("Rooms").where({ id: roomID }).update({ archived: true }).returning("*");

  if (updatedRooms.length < 1) throw new EntityNotFound(`Could not find room #${roomID}`);

  return updatedRooms[0];
}

export async function updateRoomName(
  roomID: number,
  name: string
): Promise<Room | null> {
  await knex("Rooms").where({ id: roomID }).update({
    name: name,
  });

  return await getRoomByID(roomID);
}

export async function swipeIntoRoom(roomID: number, userID: number) {
  await knex("RoomSwipes").insert({ roomID, userID });
}

export async function getRecentSwipes(roomID: number): Promise<RoomSwipeRow[]> {
  return knex("RoomSwipes")
    .select()
    .where({ roomID })
    .orderBy("dateTime", "DESC")
    .limit(10);
}
