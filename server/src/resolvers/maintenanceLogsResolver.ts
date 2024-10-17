import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository.js";
import * as UsersRepo from "../repositories/Users/UserRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { HoldRow, MaintenanceLogRow } from "../db/tables.js";
import { getEquipmentByID } from "../repositories/Equipment/EquipmentRepository.js";
import { createMaintenanceLog, deleteMaintenanceLog, getMaintenanceLogByID, getMaintenanceLogsByEquipment } from "../repositories/Equipment/MaintenanceLogRepository.js";
import { GraphQLError } from "graphql";

const MaintenanceLogsResolver = {
  MaintenanceLog: {
    author: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return UsersRepo.getUserByID(parent.authorID);
      }),

    equipment: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.equipmentID && getEquipmentByID(parent.equipmentID)
      ),
  },

  Query: {
    getMaintenanceLogsByEquipment: async (
      _parent: any,
      args: {equipmentID: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => getMaintenanceLogsByEquipment(args.equipmentID)
      ),
  },

  Mutation: {
    createMaintenanceLog: async (
      _parent: any,
      args: {equipmentID: number, content: string},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          await createLog(`{user} created a maintenance log for {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: args.equipmentID, label: (await getEquipmentByID(args.equipmentID)).name});
          return createMaintenanceLog(user.id, args.equipmentID, args.content);
        }
      ),
    deleteMaintenanceLog: async (
      _parent: any,
      args: {id: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.STAFF],
        async (user) => {
          const equipment = await getMaintenanceLogByID(args.id);
          if (!equipment) throw new GraphQLError("Equipment does not exist");
          await createLog(`{user} deleted a maintenance log from {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: equipment.id, label: (await getEquipmentByID(equipment.equipmentID)).name});
          return deleteMaintenanceLog(args.id);
        }
      ),
  },
};

export default MaintenanceLogsResolver;
