import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { RoomRepo } from "../repositories/Rooms/RoomRepository";
import * as UserRepo from "../repositories/Users/UserRepository";
import {AuditLogsInput} from "../models/auditLogs/auditLogsInput";
import {EventType} from "../models/auditLogs/eventTypes";
import AuditLogResolvers from "./auditLogsResolver";

const er = new EquipmentRepository();
const rr = new RoomRepo();

const RoomResolvers = {
  Query: {
    rooms: async (_: any, args: any, context: any) => {
      return await rr.getRooms();
    },

    room: async (_: any, args: any, context: any) => {
      return await rr.getRoomByID(args.id);
    },

    roomByEquipment: async (_: any, args: any, context: any) => {
      const equip = await er.getEquipmentById(args.equipmentID);
      if (equip) {
        return await rr.getRoomByID(equip.roomID);
      }
    },
    roomByLabbie: async (_: any, args: any, context: any) => {
      const labbie = await UserRepo.getUserByID(args.labbieID);
      if (labbie) {
        return await rr.getRoomByID(labbie.roomID);
      }
    },
  },

  Mutation: {
    addRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.ROOM_MANAGEMENT,
        description: "Added new room " + args.room.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.addRoom(args.room);
    },

    removeRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.ROOM_MANAGEMENT,
        description: "Removed room #" + args.id
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.removeRoom(args.id);
    },

    updateRoomName: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.ROOM_MANAGEMENT,
        description: "Update room #" + args.id + " to " + args.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.updateRoomName(args.id, args.name);
    },

    addEquipmentToRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.EQUIPMENT_MANAGEMENT,
        description: "Added equipment #" + args.equipmentID + " to room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.addEquipmentToRoom(args.roomID, args.equipmentID);
    },

    removeEquipmentFromRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.EQUIPMENT_MANAGEMENT,
        description: "Removed equipment #" + args.equipmentID + " from room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.removeEquipmentFromRoom(args.roomID, args.equipmentID);
    },

    addLabbieToMonitorRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Added Labbie #" + args.labbieID + " to monitor room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.addLabbieToRoom(args.roomID, args.labbieID);
    },

    removeLabbieFromMonitorRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Removed Labbie #" + args.labbieID + " from monitoring room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.removeLabbieFromRoom(args.roomID, args.labbieID);
    },

    addUserToRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Added User #" + args.labbieID + " to room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.addUserToRoom(args.roomID, args.userID);
    },

    removeUserFromRoom: async (_: any, args: any, context: any) => {
      let logInput: AuditLogsInput = {
        userID: context.getUser().id,
        eventType: EventType.USER_MANAGEMENT,
        description: "Removed User #" + args.labbieID + " from room #" + args.roomID
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await rr.removeUserFromRoom(args.roomID, args.userID);
    },
  },
};

export default RoomResolvers;
