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
  Room: {
    //Map equipment field to array of published Equipment
    equipment: async (parent: Room) => {
      return await EquipmentRepo.getEquipmentWithRoomID(parent.id, false);
    },

    //Map zone field to Zone
    zone: async (parent: Room) => {
      if (parent.zoneID === null) return null;
      return await ZoneRepo.getZoneByID(parent.zoneID);
    },

    //Map recentSwipes field to array of recent RoomSwipes
    recentSwipes: async (parent: Room) => {
      const swipes = await RoomRepo.getRecentSwipes(parent.id);
      return swipes.map(async (s) => ({
        id: s.id,
        dateTime: s.dateTime,
        user: await UserRepo.getUserByID(s.userID),
      }));
    },
  },

  Query: {
    /**
     * Fetch all Rooms
     * @returns all Rooms
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    rooms: async (
      _:any,
      args: {null:any},
      {ifAllowed}: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        return await RoomRepo.getRooms();
    }),

    /**
     * Fetch Room by ID
     * @argument id ID of Room
     * @returns Room
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    room: async (parent: any, args: { id: string }) => {
      return await RoomRepo.getRoomByID(Number(args.id));
    },
  },

  Mutation: {
    /**
     * Create a Room
     * @argument room Room input
     * @returns new Room
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    addRoom: async (parent: any, args: {room: Room}, { ifAllowed }: ApolloContext) =>
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

    archiveRoom: async (_parent: any, args: any) => {
      return await RoomRepo.archiveRoom(args.id);
    },

    deleteRoom: async (_parent: any, args: {roomID: number}, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        await RoomRepo.deleteRomm(args.roomID);
      }),

    /**
     * Update the name of a Room
     * @argument id ID of Room to modify
     * @argument name new Room name
     * @returns updated Room
     * @throws GraphQLError if not STAFF or is on hold
     */
    updateRoomName: async (_parent: any, args: {roomID: number, name: string}, { ifAllowed }: ApolloContext) => {
      return ifAllowed([Privilege.STAFF], async () => await RoomRepo.updateRoomName(args.roomID, args.name));
    },

    /**
     * Update the zone of a Room
     * @argument roomID ID of Room to modify
     * @argument zoneID new Zone ID
     * @returns updated Room
     * @throws GraphQLError if not STAFF or is on hold
     */
    setZone: async (_parent: any, args: {roomID: number, zoneID: number}, { ifAllowed }: ApolloContext) => {
      return ifAllowed([Privilege.STAFF], async () => await RoomRepo.updateZone(args.roomID, args.zoneID));
    },

    swipeIntoRoomWithID: async (
      _parent: any,
      args: { roomID: string; id: number }
    ) => {
      const room = await RoomRepo.getRoomByID(Number(args.roomID));
      assert(room);

      const user = await UserRepo.getUserByID(args.id);

      if (!user) return null;

      await RoomRepo.swipeIntoRoom(Number(args.roomID), user.id);

      await createLog(
        "{user} was manually signed into {room}.",
        "welcome",
        { id: user.id, label: getUsersFullName(user) },
        { id: room.id, label: room.name }
      );

      return user;
    },
  },
};

export default RoomResolvers;
