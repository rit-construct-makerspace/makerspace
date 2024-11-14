import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import * as HoldsRepo from "../repositories/Holds/HoldsRepository.js";
import * as UsersRepo from "../repositories/Users/UserRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import { HoldRow, MaintenanceLogRow, MaintenanceTagRow } from "../db/tables.js";
import { getEquipmentByID } from "../repositories/Equipment/EquipmentRepository.js";
import { createMaintenanceLog, createMaintenanceTag, createResolutionLog, deleteMaintenanceLog, deleteMaintenanceTag, deleteResolutionLog, getMaintenanceLogByID, getMaintenanceLogsByEquipment, getMaintenanceTagByID, getMaintenanceTags, getMaintenanceTagsByEquipmentOrGlobal, getResolutionLogByID, getResolutionLogsByEquipment, updateMaintenanceLog, updateMaintenanceTag, updateResolutionLog } from "../repositories/Equipment/MaintenanceLogRepository.js";
import { GraphQLError } from "graphql";
import { getInstanceByID } from "../repositories/Equipment/EquipmentInstancesRepository.js";
import { notifyMachineIssueCreated } from "../slack/slack.js";

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

    instance: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.instanceID && getInstanceByID(parent.instanceID)
      ),

    tag1: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID1 && getMaintenanceTagByID(parent.tagID1)
      ),
    tag2: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID2 && getMaintenanceTagByID(parent.tagID2)
      ),
    tag3: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID3 && getMaintenanceTagByID(parent.tagID3)
      ),
  },

  ResolutionLog: {
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

    instance: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.instanceID && getInstanceByID(parent.instanceID)
      ),

    tag1: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID1 && getMaintenanceTagByID(parent.tagID1)
      ),
    tag2: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID2 && getMaintenanceTagByID(parent.tagID2)
      ),
    tag3: async (
      parent: MaintenanceLogRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => parent.tagID3 && getMaintenanceTagByID(parent.tagID3)
      ),
  },

  MaintenanceTag: {
    equipment: async (
      parent: MaintenanceTagRow,
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
      args: { equipmentID: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => getMaintenanceLogsByEquipment(args.equipmentID)
      ),
    getResolutionLogsByEquipment: async (
      _parent: any,
      args: { equipmentID: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => getResolutionLogsByEquipment(args.equipmentID)
      ),
    getMaintenanceTags: async (
      _parent: any,
      args: {equipmentID?: number},
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => {
          return !args.equipmentID ? getMaintenanceTags() : getMaintenanceTagsByEquipmentOrGlobal(args.equipmentID)
        }
      ),
    getMaintenanceTagByID: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async () => getMaintenanceTagByID(args.id)
      ),
  },

  Mutation: {
    createMaintenanceLog: async (
      _parent: any,
      args: { equipmentID: number, instanceID?: number, content: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          await createLog(`{user} created a maintenance log for {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: args.equipmentID, label: (await getEquipmentByID(args.equipmentID)).name });
          const result = await createMaintenanceLog(user.id, args.equipmentID, args.instanceID == 0 ? undefined : args.instanceID, args.content);
          console.log(args)
          await notifyMachineIssueCreated(args.equipmentID, args.instanceID, args.content)
          return result;
        }
      ),
    createResolutionLog: async (
      _parent: any,
      args: { equipmentID: number, instanceID?: number, issue: string, content: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          await createLog(`{user} created a resolution log for {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: args.equipmentID, label: (await getEquipmentByID(args.equipmentID)).name });
          return createResolutionLog(user.id, args.equipmentID, ((!args.instanceID && args.instanceID != 0) ? undefined : args.instanceID), args.issue, args.content);
        }
      ),
    deleteMaintenanceLog: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const equipment = await getMaintenanceLogByID(args.id);
          if (!equipment) throw new GraphQLError("Equipment does not exist");
          await createLog(`{user} deleted a maintenance log from {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: (await getEquipmentByID(equipment.equipmentID)).name });
          return deleteMaintenanceLog(args.id);
        }
      ),
    deleteResolutionLog: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const equipment = await getResolutionLogByID(args.id);
          if (!equipment) throw new GraphQLError("Equipment does not exist");
          await createLog(`{user} deleted a resolution log from {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: (await getEquipmentByID(equipment.equipmentID)).name });
          return deleteResolutionLog(args.id);
        }
      ),
    createMaintenanceTag: async (
      _parent: any,
      args: { equipmentID?: number, label: string, color: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          await createLog(`{user} created a maintenance tag "${args.label}"`, "admin", { id: user.id, label: getUsersFullName(user) });
          return createMaintenanceTag(args.equipmentID ?? null, args.label, args.color);
        }
      ),
    deleteMaintenanceTag: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const orig = await getMaintenanceTagByID(args.id);
          if (!orig) throw new GraphQLError("Tag does not exist");
          await createLog(`{user} deleted a maintenance tag "${orig.label}"`, "admin", { id: user.id, label: getUsersFullName(user) });
          return deleteMaintenanceTag(args.id);
        }
      ),
    updateMaintenanceTag: async (
      _parent: any,
      args: { id: number, label?: string, color?: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const orig = await getMaintenanceTagByID(args.id);
          if (!orig) throw new GraphQLError("Tag does not exist");
          await createLog(`{user} updated a maintenance tag "${orig.label}"`, "admin", { id: user.id, label: getUsersFullName(user) });
          return updateMaintenanceTag(args.id, args.label ?? orig.label, args.color ?? orig.color);
        }
      ),
    addTagToLog: async (
      _parent: any,
      args: { logId: number, tagId: number, logType: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const log: any = args.logType == "resolution" ? await getResolutionLogByID(args.logId) : await getMaintenanceLogByID(args.logId);
          if (!log) throw new GraphQLError("Log does not exist");
          const tag = await getMaintenanceTagByID(args.tagId);
          if (!tag) throw new GraphQLError("Tag does not exist");
          const equipment = await getEquipmentByID(log.equipmentID);

          var tag1 = log.tagID1, tag2 = log.tagID2, tag3 = log.tagID3;
          if (!tag1) {
            tag1 = args.tagId;
          } else if (!tag2) {
            tag2 = args.tagId;
          } else if (!tag3) {
            tag3 = args.tagId;
          } else {
            throw new GraphQLError("Maximum of 3 tags on entry has been reached.")
          }

          await createLog(`{user} added tag "${tag.label}" to ${args.logType ?? "maintenance"} log (ID ${log.id}) on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: log.equipmentID, label: equipment.name });
          return args.logType != "resolution" ? updateMaintenanceLog(log.id, log.content, tag1, tag2, tag3) : updateResolutionLog(log.id, log.content, log.issue, tag1, tag2, tag3);
        }
      ),
    removeTagFromLog: async (
      _parent: any,
      args: { logId: number, tagId: number, logType: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed(
        [Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const log: any = args.logType == "resolution" ? await getResolutionLogByID(args.logId) : await getMaintenanceLogByID(args.logId);
          if (!log) throw new GraphQLError("Log does not exist");
          const tag = await getMaintenanceTagByID(args.tagId);
          if (!tag) throw new GraphQLError("Tag does not exist");
          const equipment = await getEquipmentByID(log.equipmentID);

          var tag1: any = log.tagID1, tag2: any = log.tagID2, tag3: any = log.tagID3;
          if (tag1 == args.tagId) {
            tag1 = null;
          } else if (tag2 == args.tagId) {
            tag2 = null;
          } else if (tag3 == args.tagId) {
            tag3 = null;
          } else {
            throw new GraphQLError("Tag is not referenced on entry.")
          }

          await createLog(`{user} removed tag "${tag.label}" from ${args.logType ?? "maintenance"} log (ID ${log.id}) on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: log.equipmentID, label: equipment.name });
          return args.logType != "resolution" ? updateMaintenanceLog(log.id, log.content, tag1, tag2, tag3) : updateResolutionLog(log.id, log.issue, log.content, tag1, tag2, tag3);
        }
      ),
  },
};

export default MaintenanceLogsResolver;
