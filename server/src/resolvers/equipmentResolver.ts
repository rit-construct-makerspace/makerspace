import { Equipment } from "../models/equipment/equipment";
import { EquipmentInput } from "../models/equipment/equipmentInput";
import { EquipmentLabel } from "../models/equipment/equipmentLabel";
import { EquipmentLabelInput } from "../models/equipment/equipmentLabelInput";
import { Reservation } from "../models/equipment/reservation";
import { ReservationInput } from "../models/equipment/reservationInput";
import { EquipmentRepository } from "../repositories/Equipment/EquipmentRepository";
import { ReservationRepository } from "../repositories/Equipment/ReservationsRepository";

const equipmentRepo = new EquipmentRepository();
const reservationRepo = new ReservationRepository();

const EquipmentResolvers = {

  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await equipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { Id: number }, context: any) => {
      return await equipmentRepo.getEquipmentById(args.Id);
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