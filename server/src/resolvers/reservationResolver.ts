import { ReservationInput } from "../models/equipment/reservationInput";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";

const reservationRepo = new ReservationRepository();

const ReservationResolvers = {

  Query: {
    reservations: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { Id: number }, context: any) => {
      return await reservationRepo.getReservationById(args.Id);
    },

    reservationByUser: async (_: any, args: { Id: number }, context: any) => {
        return await reservationRepo.getReservationById(args.Id);
    },
    
  },

  Mutation: {

    createReservation: async (_: any, args: { reservation: ReservationInput }) => {
      return await reservationRepo.createReservation(args.reservation);
    },

    assignLabbieToReservation: async (_: any, args: { resId: number, labbieId: number }) => {
      return await reservationRepo.assignLabbieToReservation(args.resId, args.labbieId);
    },

    removeLabbieFromReservation: async (_: any, args: { resId: number, labbieId: number }) => {
      return await reservationRepo.removeLabbieFromReservation(args.resId, args.labbieId);
    },

    addComment: async (_: any, args: { resId: number, authorId: number, commentText: String }) => {
      return await reservationRepo.addComment(args.resId, args.authorId, args.commentText);
    },

    cancelReservation: async (_: any, args: { resId: number }) => {
      return await reservationRepo.cancelReservation(args.resId);
    },

    confirmReservation: async (_: any, args: { resId: number }) => {
      return await reservationRepo.confirmReservation(args.resId);
    }
  }
};

export default ReservationResolvers;