import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import * as RoomRepo from "../repositories/Rooms/RoomRepository";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "./usersResolver";
import { EquipmentRow } from "../db/tables";
import { EquipmentInput } from "../schemas/equipmentSchema";

const reservationRepo = new ReservationRepository();

const EquipmentResolvers = {
  Query: {
    equipments: async (_: any, args: any, context: any) => {
      return await EquipmentRepo.getEquipments();
    },

    equipment: async (_: any, args: { id: number }, context: any) => {
      return await EquipmentRepo.getEquipmentByID(args.id);
    },

    reservations: async (_: any, args: { id: number }, context: any) => {
      return await reservationRepo.getReservations();
    },

    reservation: async (_: any, args: { id: number }, context: any) => {
      return await reservationRepo.getReservationById(args.id);
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
      ifAllowed([Privilege.STAFF], async (user) => {
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
      args: { id: number; equipment: EquipmentInput },
      context: any
    ) => {
      return await EquipmentRepo.updateEquipment(args.id, args.equipment);
    },

    deleteEquipment: async (_: any, args: { id: number }, context: any) => {
      return await EquipmentRepo.archiveEquipment(args.id);
    },
  },
};

export default EquipmentResolvers;
