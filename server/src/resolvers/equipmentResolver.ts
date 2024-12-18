/**
 * equipmentResolver.ts
 * GraphQL Endpoint Implementations for Equipment
 */

import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import * as RoomRepo from "../repositories/Rooms/RoomRepository.js";
import { ReservationRepository } from "../repositories/Equipment/ReservationRepository.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { EquipmentRow } from "../db/tables.js";
import { EquipmentInput } from "../schemas/equipmentSchema.js";
import { getNumUnavailableReadersByEquipment, getNumIdleReadersByEquipment } from "../repositories/Readers/ReaderRepository.js";

const reservationRepo = new ReservationRepository();

const EquipmentResolvers = {

  Equipment: {
    //Map room field to Room
    room: async (parent: EquipmentRow) => {
      return await RoomRepo.getRoomByID(parent.roomID);
    },

    //Set true if listed user has all needed requirements to use equipment
    hasAccess: async (parent: EquipmentRow, args: { uid: string }) => {
      return await EquipmentRepo.hasAccess(args.uid, parent.id);
    },

    //Map trainingModules field to array of associated TrainingModules
    trainingModules: async (parent: EquipmentRow) => {
      return await EquipmentRepo.getModulesByEquipment(parent.id);
    },

    //Set numAvailable to number of ACS Readers that are Idle and responding
    numAvailable: async (parent: EquipmentRow) => {
      return await getNumIdleReadersByEquipment(parent.id)
    },

    //Set numInUse to number of ACS Readers that are NOT idle or are not responding
    numInUse: async (parent: EquipmentRow) => {
      return await getNumUnavailableReadersByEquipment(parent.id)
    },
  },


  Query: {
    /**
     * Fetch all published Equipment
     * @returns all published Equipment
     */
    equipments: async (_parent: any, _args: any, _context: any) => {
      return await EquipmentRepo.getEquipmentWhereArchived(false);
    },

    /**
     * Fetch specific published Equipment
     * @returns Equipment
     */
    equipment: async (_parent: any, args: { id: string }, _context: any) => {
      return await EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), false);
    },

    /**
     * Fetch all archived/hidden Equipment
     * @returns all hidden Equipment
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    archivedEquipments: async (_parent: any, _args: any, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.getEquipmentWhereArchived(true);
      }),

    /**
     * Fetch specific archived/hidden Equipment
     * @argument id ID of equipment
     * @returns Equipment
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    archivedEquipment: async (_parent: any, args: { id: string }, { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), true);
      }),

    /**
     * Fetch specific Equipment
     * @argument id ID of equipment
     * @returns Equipment
     */
    anyEquipment: async (_parent: any, args: { id: string }, _context: any) => {
      return await EquipmentRepo.getEquipmentByID(Number(args.id));
    },

    /**
     * Fetch all Equipment
     * @returns all Equipment
     */
    allEquipment: async (_parent: any, _args: any, _context: any) => {
      return await EquipmentRepo.getEquipment();
    },

  },

  Mutation: {
    /**
     * Create a new Equipment
     * @argument equipment Equipment Input
     * @returns new Equipment
     * @throws GraphQLError if not STAFF or is on hold
     */
    addEquipment: async (
      _parent: any,
      args: { equipment: EquipmentInput },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (user: any) => {
        const equipment = await EquipmentRepo.addEquipment(args.equipment);

        await createLog(
          "{user} created the {equipment} equipment.",
          "admin",
          { id: user.id, label: getUsersFullName(user) },
          { id: equipment.id, label: equipment.name }
        );

        return equipment;
      }),

    /**
     * Modify an existing Equipment
     * @argument id ID of Equipment to modify
     * @argument equipment Equipment Input for new values
     * @returns updated Equipment
     * @throws GraphQLError if not STAFF or MENTOR or is on hold
     */
    updateEquipment: async (
      _: any,
      args: { id: string; equipment: EquipmentInput },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        console.log(args.equipment)
        return await EquipmentRepo.updateEquipment(Number(args.id), args.equipment);
    }),

    /**
     * Set an Equipment as archived/hidden
     * @argument id ID of Equipment to modify
     * @returns updated Equipment
     * @throws GraphQLError if not STAFF or MENTOR or is on hold
     */
    archiveEquipment: async (_: any, args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.setEquipmentArchived(args.id, true);
    }),

    /**
     * Set an Equipment as published
     * @argument id ID of Equipment to modify
     * @returns updated Equipment
     * @throws GraphQLError if not STAFF or MENTOR or is on hold
     */
    publishEquipment: async (_: any, args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await EquipmentRepo.setEquipmentArchived(args.id, false);
    }),
  },
};

export default EquipmentResolvers;
