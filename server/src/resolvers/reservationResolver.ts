import {ReservationInput} from "../models/equipment/reservationInput";
import {ReservationRepository} from "../repositories/Equipment/ReservationRepository";
import {ApolloContext} from "../context";
import {Privilege} from "../schemas/usersSchema";
import {createLog} from "../repositories/AuditLogs/AuditLogRepository";
import {getUserByIDForReservationCard, getUsersFullName} from "../repositories/Users/UserRepository";
import {getEquipmentByIDForReservationCard} from "../repositories/Equipment/EquipmentRepository";
import {ReservationEventRow} from "../db/tables";
import {knex} from "../db";
import {ReservationForCard, ReservationStatus} from "../models/equipment/reservation";

const reservationRepo = new ReservationRepository();

 async function getResEvents(resID: number): Promise<Pick<ReservationEventRow, "id" | "payload">[]>{
  return knex("ReservationEvents")
      .where({id: resID})
      .select('id', 'payload');
}

const ReservationResolvers = {

  Query: {
    reservations: async (_: any, args: any, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservationIDsByExpert: async (_: any, args: { expertID: number }, context: any)=> {
        let temp = await reservationRepo.getReservationIDSPerExpert(args.expertID)
        return temp.map((a) => {
            return a
        })
    },

    reservationForCard: async (_: any, args: { id: number }, context: any) => {
      const reservationRow = await reservationRepo.getReservationForCardByID(args.id);
      let maker = await getUserByIDForReservationCard(reservationRow[0].makerID)
      let equip = await getEquipmentByIDForReservationCard(reservationRow[0].equipmentID)
      let events = await getResEvents(reservationRow[0].id)

        let s = reservationRow[0].status

        let temp = {
            id: reservationRow[0].id,
            maker: {id: maker.id, name: maker.firstName + " " + maker.lastName, image: "https://t4.ftcdn.net/jpg/03/83/25/83/240_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg", role: maker.privilege}, //temp
            equipment: {id: equip.id, name: equip.name, image: "https://cdn.discordapp.com/attachments/1176296914556309539/1176297174041112766/laser-engraver-for-metal.jpg?ex=656e5b1c&is=655be61c&hm=033e2b1153b169a231e5cb72352e7b44b7ee568bc02d3b260319c1ed02f94f3a&"}, //temp
            startTime: reservationRow[0].startTime.toISOString(),
            endTime: reservationRow[0].endTime.toISOString(),
            comment: events[0].payload,
            attachments: [],
            status: reservationRow[0].status
            //status: s === "CANCELLED" ? ReservationStatus.CANCELLED : (s === "CONFIRMED" ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING)
        } as ReservationForCard

        return temp
    },

    reservation: async (_: any, args: { id: string }, context: any) => {
      return await reservationRepo.getReservationById(Number(args.id));
    }
  },

  Mutation: {

    addReservation: async (
      _parent: any,
      args: { reservation: ReservationInput },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.STAFF], async (user) => {
        const eligible = true //await reservationRepo.userIsEligible(args.reservation);
        const noConflicts = true //await reservationRepo.noConflicts(args.reservation);
        if (eligible && noConflicts) {
          const reservation = await reservationRepo.addReservation(args.reservation);

        await createLog(
          "{user} created the {reservation} reservation.",
          { id: user.id, label: getUsersFullName(user) },
          { id: reservation.id, label: reservation.id.toString() }
        );

        return reservation;

        } else {
          return null;
        }
        
      }),

    addComment: async (_parent: any, args: { resID: string, commentText: string },
    { ifAllowed }: ApolloContext) => 
        ifAllowed([Privilege.MAKER], async (user) => {
          return await reservationRepo.addComment(Number(args.resID), user.id, args.commentText);
    }),

    confirmReservation: async (_parent: any,
      args: { resID: string },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        return await reservationRepo.confirmReservation(Number(args.resID));
    });
    },

    cancelReservation: async (_parent: any,
      args: { resID: string },
      { ifAllowed }: ApolloContext
    ) => {
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        return await reservationRepo.cancelReservation(Number(args.resID));
    });
    }
  }
};

export default ReservationResolvers;