import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import * as RoomRepo from "../repositories/Rooms/RoomRepository.js";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { EquipmentRow } from "../db/tables.js";
import { EquipmentInput } from "../schemas/equipmentSchema.js";

const reservationRepo = new ReservationRepository();

const EquipmentResolvers = {
  Query: {
    equipments: async (_parent: any, _args: any, _context: any) => {
      return await EquipmentRepo.getEquipmentWhereArchived(false);
    },

    equipment: async (_parent: any, args: { id: string }, _context: any) => {
      return await EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), false);
    },

    archivedEquipments: async (_parent: any, _args: any, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.getEquipmentWhereArchived(true);
      }),

    archivedEquipment: async (_parent: any, args: { id: string }, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), true);
      }),

    reservations: async (_parent: any, _args: any, _context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_parent: any, args: { id: string }, _context: any) => {
      return await reservationRepo.getReservationById(Number(args.id));
    },

    anyEquipment: async (_parent: any, args: { id: string }, _context: any) => {
      return await EquipmentRepo.getEquipmentByID(Number(args.id));
    },

  },

  Equipment: {
    room: async (parent: EquipmentRow) => {
      return await RoomRepo.getRoomByID(parent.roomID);
    },

    hasAccess: async (parent: EquipmentRow, args: { uid: string }) => {
      return await EquipmentRepo.hasAccess(args.uid, parent.id);
    },

    trainingModules: async (parent: EquipmentRow) => {
      return await EquipmentRepo.getModulesByEquipment(parent.id);
    },
  },

  Mutation: {
    addEquipment: async (
      _parent: any,
      args: { equipment: EquipmentInput },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (user: any) => {
        const equipment = await EquipmentRepo.addEquipment(args.equipment);

        await createLog(
          "{user} created the {equipment} equipment.",
          { id: user.id, label: getUsersFullName(user) },
          { id: equipment.id, label: equipment.name }
        );

        return equipment;
      }),

    updateEquipment: async (
      _: any,
      args: { id: string; equipment: EquipmentInput },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.updateEquipment(Number(args.id), args.equipment);
    }),

    archiveEquipment: async (_: any, args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.setEquipmentArchived(args.id, true);
    }),

    publishEquipment: async (_: any, args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.setEquipmentArchived(args.id, false);
    }),
  },
};

export default EquipmentResolvers;
