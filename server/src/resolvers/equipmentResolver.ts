import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";
import { Equipment } from "../models/equipment/equipment";
import { RoomRepo } from "../repositories/Rooms/RoomRepository";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";

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
    addEquipment: async (
      _: any,
      args: { equipment: EquipmentInput },
      context: any
    ) => {
      const equipment = await equipmentRepo.addEquipment(args.equipment);

      await createLog(
        `user:${context.user.userID} added the equipment:${equipment?.id} equipment.`
      );

      return equipment;
    },

    updateEquipment: async (
      _: any,
      args: { id: number; equipment: EquipmentInput },
      context: any
    ) => {
      await createLog(
        `user:${context.user.userID} updated the equipment:${args.id} equipment.`
      );

      return await equipmentRepo.updateEquipment(args.id, args.equipment);
    },

    removeEquipment: async (_: any, args: { id: number }, context: any) => {
      await createLog(
        `user:${context.user.userID} removed the equipment:${args.id} equipment.`
      );

      return await equipmentRepo.removeEquipment(args.id);
    },
  },
};

export default EquipmentResolvers;
