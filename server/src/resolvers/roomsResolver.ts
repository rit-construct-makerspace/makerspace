import * as RoomRepo from "../repositories/Rooms/RoomRepository.js";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import * as UserRepo from "../repositories/Users/UserRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import assert from "assert";
import { Room } from "../models/rooms/room.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import * as ZoneRepo from "../repositories/Zones/ZonesRespository.js";

const RoomResolvers = {
  Query: {
    rooms: async (
      _:any,
      args: {null:any},
      {ifAllowed}: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        return await RoomRepo.getRooms();
    }),

    room: async (parent: any, args: { id: string }) => {
      return await RoomRepo.getRoomByID(Number(args.id));
    },
  },

  Room: {
    equipment: async (parent: Room) => {
      return await EquipmentRepo.getEquipmentWithRoomID(parent.id, false);
    },

    zone: async (parent: Room) => {
      if (parent.zoneID === null) return null;
      return await ZoneRepo.getZoneByID(parent.zoneID);
    },

    recentSwipes: async (parent: Room) => {
      const swipes = await RoomRepo.getRecentSwipes(parent.id);
      return swipes.map(async (s) => ({
        id: s.id,
        dateTime: s.dateTime,
        user: await UserRepo.getUserByID(s.userID),
      }));
    },
  },

  Mutation: {
    addRoom: async (parent: any, args: any, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async (user: any) => {
        const newRoom = await RoomRepo.addRoom(args.room);

        await createLog(
          "{user} created the {room} room.",
          "admin",
          { id: user.id, label: getUsersFullName(user) },
          { id: newRoom.id, label: newRoom.name }
        );

        return newRoom;
      }),

    removeRoom: async (_parent: any, args: any) => {
      return await RoomRepo.archiveRoom(args.id);
    },

    updateRoomName: async (_parent: any, args: any) => {
      return await RoomRepo.updateRoomName(args.id, args.name);
    },

    setZone: async (_parent: any, args: any) => {
      console.log(args);
      return await RoomRepo.updateZone(args.roomID, args.zoneID);
    },

    swipeIntoRoom: async (
      _parent: any,
      args: { roomID: string; universityID: string }
    ) => {
      const room = await RoomRepo.getRoomByID(Number(args.roomID));
      assert(room);

      const user = await UserRepo.getUserByUniversityID(args.universityID);

      if (!user) return null;

      await RoomRepo.swipeIntoRoom(Number(args.roomID), user.id);

      await createLog(
        "{user} swiped into the {room}.",
        "welcome",
        { id: user.id, label: getUsersFullName(user) },
        { id: room.id, label: room.name }
      );

      return user;
    },
  },
};

export default RoomResolvers;
