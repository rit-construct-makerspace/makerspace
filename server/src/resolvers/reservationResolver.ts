import { ReservationInput } from "../models/equipment/reservationInput";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName, hashUniversityID } from "./usersResolver";

const reservationRepo = new ReservationRepository();

const ReservationResolvers = {

  Query: {
    reservations: async (_: any, args: { id: number }, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { id: number }, context: any) => {
      return await reservationRepo.getReservationById(args.id);
    }
  },

  Mutation: {

    createReservation:async (
      _parent: any,
      args: { reservation: ReservationInput },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MAKER], async (user) => {
        const eligible = await reservationRepo.userIsEligible(args.reservation);
        const noConflicts = await reservationRepo.noConflicts(args.reservation);
        if (eligible && noConflicts) {
          const reservation = await reservationRepo.createReservation(args.reservation);

        await createLog(
          "{user} created the {reservation} reservation.",
          { id: user.id, label: getUsersFullName(user) },
          { id: reservation.id, label: reservation.id.toString() }
        );

        return reservation;

        } else {
          return null;
        }
        
      })
    },

    addComment: async (_parent: any, args: { resID: number, commentText: string },
    { ifAllowed }: ApolloContext) => 
        ifAllowed([Privilege.MAKER], async (user) => {
          return await reservationRepo.addComment(args.resID, user.id, args.commentText);
    }),

    confirmReservation: async (_parent: any,
      args: { resID: number },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.LABBIE], async (user) => {
        return await reservationRepo.confirmReservation(args.resID);
    });
    },

    cancelReservation: async (_parent: any,
      args: { resID: number },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.LABBIE], async (user) => {
        return await reservationRepo.cancelReservation(args.resID);
    });
    }
  }
};

export default ReservationResolvers;