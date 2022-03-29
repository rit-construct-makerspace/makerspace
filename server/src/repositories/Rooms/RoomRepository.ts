import { Room } from "../../models/rooms/room";
import { knex } from "../../db";
import {
  singleRoomToDomain,
  roomsToDomain,
} from "../../mappers/rooms/roomMapper";
import { Swipe } from "../../schemas/roomsSchema";
import assert from "assert";
import {getEquipmentById} from "../Equipment/EquipmentRepository";

export async function getRoomByID(roomID: number): Promise<Room | null> {
  const knexResult = await knex
    .first("id", "name")
    .from("Rooms")
    .where("id", roomID);

  return singleRoomToDomain(knexResult);
}

export async function getRooms(): Promise<Room[]> {
  const knexResult = await knex("Rooms").select("Rooms.id", "Rooms.name");
  return roomsToDomain(knexResult);
}

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

export async function archiveRoom(roomID: number): Promise<Room | null> {
  await knex("Rooms").where({ id: roomID}).update({archived: true})
  return getRoomByID(roomID);
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

export async function getRecentSwipes(roomID: number): Promise<Swipe[]> {
  return knex("RoomSwipes")
    .select()
    .where({ roomID })
    .orderBy("dateTime", "DESC")
    .limit(10);
}
