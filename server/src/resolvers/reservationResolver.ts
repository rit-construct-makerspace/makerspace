import { ReservationInput } from "../models/equipment/reservationInput.js";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";

const reservationRepo = new ReservationRepository();

const ReservationResolvers = {

  Query: {
    reservations: async (_: any, args: any, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { id: string }, context: any) => {
      return await reservationRepo.getReservationById(Number(args.id));
    }
  },

  Mutation: {

    createReservation:async (
      _parent: any,
      args: { reservation: ReservationInput },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MAKER], async (user: any) => {
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

    addComment: async (_parent: any, args: { resID: string, commentText: string },
    { ifAllowed }: ApolloContext) => 
        ifAllowed([Privilege.MAKER], async (user: any) => {
          return await reservationRepo.addComment(Number(args.resID), user.id, args.commentText);
    }),

    confirmReservation: async (_parent: any,
      args: { resID: string },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MENTOR], async (user) => {
        return await reservationRepo.confirmReservation(Number(args.resID));
    });
    },

    cancelReservation: async (_parent: any,
      args: { resID: string },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MENTOR], async (user) => {
        return await reservationRepo.cancelReservation(Number(args.resID));
    });
    }
  }
};

export default ReservationResolvers;