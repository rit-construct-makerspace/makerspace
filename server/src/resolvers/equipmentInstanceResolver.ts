import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import * as RoomRepo from "../repositories/Rooms/RoomRepository.js"
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository.js";
import { getUserByID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { getEquipmentSessions } from "../repositories/Equipment/EquipmentSessionsRepository.js";
import { getRoomByID } from "../repositories/Rooms/RoomRepository.js";
import { getZoneByID } from "../repositories/Zones/ZonesRespository.js";
import { EquipmentInstancesRow } from "../db/tables.js";
import { createInstance, deleteInstance, getInstanceByID, getInstancesByEquipment, setInstanceName, setInstanceStatus } from "../repositories/Equipment/EquipmentInstancesRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { GraphQLError } from "graphql";

const EquipmentInstanceResolver = {
  EquipmentInstance: {
    //Fetch full data for equipment field
    equipment: async (
      parent: EquipmentInstancesRow,
      _args: any,
      _context: ApolloContext) => {
      return EquipmentRepo.getEquipmentByID(Number(parent.equipmentID));
    },
  },

  Query: {
    /**
     * Fetch all equipment instances by equipment
     * @argument equipmentID ID of equipment to filter by
     * @returns all matching Equipment Instances
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    equipmentInstances: async (
      _parent: any,
      args: { equipmentID: number },
      { isStaff }: ApolloContext) =>
      isStaff(async () => {
        return await getInstancesByEquipment(args.equipmentID)
      }),
  },

  Mutation: {
    /**
     * Create a new equipment instance
     * @argument equipmentID ID of equipment to reference
     * @argument name Instance name
     * @returns new equipment instance
     * @throws GraphQLError if not MENTOR or STAFF or is on hold or equipment does not exist
     */
    createEquipmentinstance: async (
      _parent: any,
      args: { equipmentID: number, name: string },
      { isManager }: ApolloContext) =>
      isManager(async (user) => {
        const equipment = await EquipmentRepo.getEquipmentByID(args.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        await createLog(`{user} created instance "${args.name}" on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name });
        return await createInstance(args.equipmentID, args.name)
      }),

    /**
     * Update the status field of an Equipment Instance
     * @argument id ID of equipment instance to modify
     * @argument status New Instance status
     * @returns updated equipment instance
     * @throws GraphQLError if not MENTOR or STAFF or is on hold or equipment instance does not exist
     */
    setInstanceStatus: async (
      _parent: any,
      args: { id: number, status: string },
      { isStaff }: ApolloContext) =>
      isStaff(async (user) => {
        const orig = await getInstanceByID(args.id);
        if (!orig) throw new GraphQLError("Instance does not exist");
        const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        const room = await RoomRepo.getRoomByID(equipment.roomID);
        if (!user.staff.includes(room?.zoneID ?? -1) && !user.manager.includes(room?.zoneID ?? -1) && !user.admin) {
          throw new GraphQLError(`Not Privileged for Makerspace ${room?.zoneID}`);
        }
        await createLog(`{user} changed instance "${orig.name}" status to "${args.status}" on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name });
        return await setInstanceStatus(args.id, args.status)
      }),

    /**
     * Update the name field of an Equipment Instance
     * @argument id ID of equipment instance to modify
     * @argument name New Instance name
     * @returns updated equipment instance
     * @throws GraphQLError if not MENTOR or STAFF or is on hold or equipment instance does not exist
     */
    setInstanceName: async (
      _parent: any,
      args: { id: number, name: string },
      { isManager }: ApolloContext) =>
      isManager(async (user) => {
        const orig = await getInstanceByID(args.id);
        if (!orig) throw new GraphQLError("Instance does not exist");
        const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        const room = await RoomRepo.getRoomByID(equipment.roomID);
        if (!user.manager.includes(room?.zoneID ?? -1) && !user.admin) {
          throw new GraphQLError(`Not Privileged for Makerspace ${room?.zoneID}`);
        }
        await createLog(`{user} changed instance "${orig.name}" name to "${args.name}" on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name });
        return await setInstanceName(args.id, args.name)
      }),

    /**
     * Delete an Equipment Instance
     * @argument id ID of equipment instance to delete
     * @returns new equipment instance
     * @throws GraphQLError if not MENTOR or STAFF or is on hold or equipment instance does not exist
     */
    deleteInstance: async (
      _parent: any,
      args: { id: number },
      { isManager }: ApolloContext) =>
      isManager(async (user) => {
        const orig = await getInstanceByID(args.id);
        if (!orig) throw new GraphQLError("Instance does not exist");
        const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        const room = await RoomRepo.getRoomByID(equipment.roomID);
        if (!user.manager.includes(room?.zoneID ?? -1) && !user.admin) {
          throw new GraphQLError(`Not Privileged for Makerspace ${room?.zoneID}`);
        }
        await createLog(`{user} deleted instance "${orig.name}" on {equipment}`, "admin", { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name });
        return await deleteInstance(args.id)
      }),
  }
};

export default EquipmentInstanceResolver;