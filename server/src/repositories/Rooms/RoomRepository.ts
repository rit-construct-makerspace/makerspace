import { Room } from "../../models/rooms/room";
import { knex } from "../../db";
import {
  singleRoomToDomain,
  roomsToDomain,
} from "../../mappers/rooms/roomMapper";
import { Swipe } from "../../schemas/roomsSchema";

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

export async function addRoom(room: Room): Promise<Room | null> {
  const newID = (
    await knex("Rooms").insert(
      {
        name: room.name,
      },
      "id"
    )
  )[0];
  return await getRoomByID(newID);
}

export async function removeRoom(roomID: number): Promise<void> {
  await knex("Rooms").where({ id: roomID }).del();
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

export async function addLabbieToRoom(
  roomID: number,
  labbieID: number
): Promise<Room | null> {
  await knex("User").where({ id: labbieID }).update({
    roomID: roomID,
    monitoringRoomID: roomID,
  });

  return await getRoomByID(roomID);
}

export async function removeLabbieFromRoom(
  roomID: number,
  labbieID: number
): Promise<Room | null> {
  await knex("User").where({ id: labbieID }).update({
    roomID: null,
    monitoringRoomID: null,
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
