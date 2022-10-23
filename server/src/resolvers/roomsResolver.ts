import * as RoomRepo from "../repositories/Rooms/RoomRepository";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import * as UserRepo from "../repositories/Users/UserRepository";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName, hashUniversityID } from "./usersResolver";
import assert from "assert";
import { Room } from "../models/rooms/room";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";

const RoomResolvers = {
  Query: {
    rooms: async () => {
      return await RoomRepo.getRooms();
    },

    room: async (parent: any, args: { id: number }) => {
      return await RoomRepo.getRoomByID(args.id);
    },
  },

  Room: {
    equipment: async (parent: Room) => {
      return await EquipmentRepo.getEquipmentWithRoomID(parent.id);
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
      ifAllowed([Privilege.ADMIN], async (user) => {
        const newRoom = await RoomRepo.addRoom(args.room);

        await createLog(
          "{user} created the {room} room.",
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

    swipeIntoRoom: async (
      _parent: any,
      args: { roomID: number; universityID: string }
    ) => {
      const room = await RoomRepo.getRoomByID(args.roomID);
      assert(room);

      const user = await UserRepo.getUserByUniversityID(args.universityID);

      if (!user) return null;

      await RoomRepo.swipeIntoRoom(args.roomID, user.id);

      await createLog(
        "{user} swiped into the {room}.",
        { id: user.id, label: getUsersFullName(user) },
        { id: room.id, label: room.name }
      );

      return user;
    },
  },
};

export default RoomResolvers;
