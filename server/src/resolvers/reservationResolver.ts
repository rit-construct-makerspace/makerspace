import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "./usersResolver";
import * as ReservationRepo from "../repositories/Equipment/ReservationRepository";
import { ReservationInput } from "../schemas/reservationsSchema";

const ReservationResolvers = {
  Query: {
    reservations: async (_parent: any) => {
      return await ReservationRepo.getReservations();
    },

    reservation: async (_: any, args: { id: number }) => {
      return await ReservationRepo.getReservationByID(args.id);
    },
  },

  Mutation: {
    createReservation: async (
      _parent: any,
      args: { reservation: ReservationInput },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MAKER, Privilege.LABBIE, Privilege.ADMIN],
        async (user) => {
          const eligible = await ReservationRepo.userIsEligible(
            args.reservation.makerID,
            args.reservation.equipmentID
          );

          if (!eligible)
            throw new Error(
              "User has not completed all required training modules"
            );

          const noConflicts = await ReservationRepo.noConflicts(
            args.reservation.startTime,
            args.reservation.endTime,
            args.reservation.equipmentID
          );

          if (!noConflicts)
            throw new Error(
              "Reservation would conflict with existing reservations"
            );

          const reservation = await ReservationRepo.createReservation(
            args.reservation
          );

          await createLog(
            "{user} created reservation #{reservation}.",
            { id: user.id, label: getUsersFullName(user) },
            { id: reservation.id, label: reservation.id.toString() }
          );

          return reservation;
        }
      ),

    addComment: async (
      _parent: any,
      args: { resID: number; commentText: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER], async (user) => {
        return await ReservationRepo.addComment(
          args.resID,
          user.id,
          args.commentText
        );
      }),

    confirmReservation: async (
      _parent: any,
      args: { resID: number },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.LABBIE], async (user) => {
        return await ReservationRepo.confirmReservation(args.resID);
      });
    },

    cancelReservation: async (
      _parent: any,
      args: { resID: number },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.LABBIE], async (user) => {
        return await ReservationRepo.cancelReservation(args.resID);
      });
    },
  },
};

export default ReservationResolvers;
