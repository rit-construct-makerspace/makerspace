import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";
import { Equipment } from "../models/equipment/equipment";
import { RoomRepo } from "../repositories/Rooms/RoomRepository";
import {AuditLogsInput} from "../models/auditLogs/auditLogsInput";
import {EventType} from "../models/auditLogs/eventTypes";
import AuditLogResolvers from "./auditLogsResolver";

const equipmentRepo = new EquipmentRepository();
const reservationRepo = new ReservationRepository();

const EquipmentResolvers = {
  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await equipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { id: number }, context: any) => {
      return await equipmentRepo.getEquipmentById(args.id);
    },

    reservations: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservationById(args.Id);
    },

    trainingModulesByEquipment: async (
      _: any,
      args: { Id: number },
      context: any
    ) => {
      return await equipmentRepo.getTrainingModules(args.Id);
    },
  },

  Equipment: {
    room: (parent: Equipment) => {
      return new RoomRepo().getRoomByID(parent.roomID);
    },

    trainingModules: (parent: Equipment) => {
      return equipmentRepo.getTrainingModules(parent.id);
    },
  },

  Mutation: {
    addEquipment: async (_: any, args: { equipment: EquipmentInput }, context: any) => {
      let logInput: AuditLogsInput = {
        userID: 0,
        eventType: EventType.EQUIPMENT_MANAGEMENT,
        description: "Added new equipment " + args.equipment.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await equipmentRepo.addEquipment(args.equipment);
    },

    updateEquipment: async (
      _: any,
      args: { id: number; equipment: EquipmentInput }
    ) => {
      let logInput: AuditLogsInput = {
        userID: 0,
        eventType: EventType.EQUIPMENT_MANAGEMENT,
        description: "Updated equipment " + args.equipment.name
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await equipmentRepo.updateEquipment(args.id, args.equipment);
    },

    removeEquipment: async (_: any, args: { id: number }) => {
      let logInput: AuditLogsInput = {
        userID: 0,
        eventType: EventType.EQUIPMENT_MANAGEMENT,
        description: "Removed equipment #" + args.id
      }
      await AuditLogResolvers.Mutation.addLog(logInput);

      return await equipmentRepo.removeEquipment(args.id);
    },
  },
};

export default EquipmentResolvers;
