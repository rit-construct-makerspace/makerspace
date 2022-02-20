import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentLabelInput } from "../models/equipment/equipmentLabelInput";
import { ReservationInput } from "../models/equipment/reservationInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { EquipmentLabelRepository } from "../repositories/Equipment/EquipmentLabelRepository";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";

const equipmentRepo = new EquipmentRepository();
const reservationRepo = new ReservationRepository();
const equipmentLabelRepo = new EquipmentLabelRepository();

const EquipmentResolvers = {

  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await equipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { Id: number }, context: any) => {
      return await equipmentRepo.getEquipmentById(args.Id);
    },

    equipmentLabels: async (_: any, args: any, context: any) => {
      return await equipmentLabelRepo.getEquipmentLabels();
    },

    equipmentLabel: async (_: any, args: { Id: number }, context: any) => {
      return await equipmentLabelRepo.getEquipmentLabelById(args.Id);
    },

    reservations: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservationById(args.Id);
    }
  },

  Equipment: {
    equipmentLabels: (parent: any) => {
      return equipmentRepo.getLabels(parent.id);
    }
  },

  EquipmentLabel: {
    trainingModules: (parent: any) => {
      return equipmentLabelRepo.getTrainingModules(parent.id);
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
    },

    addEquipmentLabel: async (_: any, args: { equipmentLabel: EquipmentLabelInput }) => {
      return await equipmentLabelRepo.addEquipmentLabel(args.equipmentLabel);
    },

    updateEquipmentLabel: async (_: any, args: { id: number, equipmentLabel: EquipmentLabelInput }) => {
      return await equipmentLabelRepo.updateEquipmentLabel(args.id, args.equipmentLabel);
    },

    removeEquipmentLabel: async (_: any, args: { id: number }) => {
      return await equipmentLabelRepo.removeEquipmentLabel(args.id);
    },

    addReservation: async (_: any, args: { reservation: ReservationInput }) => {
      return await reservationRepo.addReservation(args.reservation);
    },

    updateReservation: async (_: any, args: { id: number, reservation: ReservationInput }) => {
      return await reservationRepo.updateReservation(args.id, args.reservation);
    },

    removeReservation: async (_: any, args: { id: number }) => {
      return await reservationRepo.removeReservation(args.id);
    }

  },
};

export default EquipmentResolvers;