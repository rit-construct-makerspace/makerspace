import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";

const equipmentRepo = new EquipmentRepository();

const EquipmentResolvers = {

  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await equipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { Id: number }, context: any) => {
      return await equipmentRepo.getEquipmentById(args.Id);
    },

    trainingModulesByEquipment: async (_: any, args: { Id: number }, context: any) => {
      return await equipmentRepo.getTrainingModules(args.Id);
    }
  },

  Equipment: {
    trainingModules: (parent: any) => {
      return equipmentRepo.getTrainingModules(parent.id);
    }
  },

  Mutation: {

    addEquipment: async (_: any, args: { equipment: EquipmentInput }) => {
      return await equipmentRepo.addEquipment(args.equipment);
    },

    updateEquipment: async (_: any, args: { id: number, equipment: EquipmentInput }) => {
      return await equipmentRepo.updateEquipment(args.id, args.equipment);
    },

    removeEquipment: async (_: any, args: { id: number }) => {
      return await equipmentRepo.removeEquipment(args.id);
    }
  }
};

export default EquipmentResolvers;