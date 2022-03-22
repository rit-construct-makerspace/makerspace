import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { Equipment } from "../models/equipment/equipment";
import { RoomRepo } from "../repositories/Rooms/RoomRepository";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";

const equipmentRepo = new EquipmentRepository();

const EquipmentResolvers = {
  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await equipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { id: number }, context: any) => {
      return await equipmentRepo.getEquipmentById(args.id);
    },

    trainingModulesByEquipment: async (_: any, args: { Id: number }, context: any) => {
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
      return await equipmentRepo.addEquipment(args.equipment);
    },

    updateEquipment: async (
      _: any,
      args: { id: number; equipment: EquipmentInput },
      context: any
    ) => {
      return await equipmentRepo.updateEquipment(args.id, args.equipment);
    },

    removeEquipment: async (_: any, args: { id: number }, context: any) => {
      return await equipmentRepo.removeEquipment(args.id);
    }
  }
};

export default EquipmentResolvers;
