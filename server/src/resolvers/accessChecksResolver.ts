/**
 * accessChecksRepository.ts
 * GraphQL Endpoint Implementations for Access Checks
 */

import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { accessCheckExists, createAccessCheck, getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, getAccessChecksByUserID, purgeUnapprovedAccessChecks, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUserByID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { GraphQLError } from "graphql";
import { AccessCheckRow } from "../db/tables.js";

const AccessChecksResolver = {
  AccessCheck: {
    equipment: async (parent: AccessCheckRow) => {
      return await EquipmentRepo.getEquipmentByID(parent.equipmentID);
    }
  },

  Query: {
    /**
     * Fetch all Access Checks
     * @returns all Access Checks
     * @throws GraphQLError if not MENTOR or STAFF or on hold
     */
    accessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecks();
      }),

    /**
     * Fetch access check by ID
     * @argument id ID of Access Check
     * @returns Access Check or undefined if not exist
     * @throws  GraphQLError if not MENTOR or STAFF or on hold
     */
    accessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessCheckByID(args.id)
      }),
    
    /**
     * Fetch all the access checks for a UserID
     * @argument userID userID to get access checks for
     * @returns All access checks for a UserID
     * @throws GraphQLError if not MAKER or MENTOR or STAFF
     */
    accessChecksByUserID: async (
      _parent: any,
      args: { userID: number },
      { ifAuthenticated }: ApolloContext) =>
        ifAuthenticated(async () => {
          return await getAccessChecksByUserID(args.userID)
      }),

    /**
     * Fetch all approved Access Checks
     * @returns all approved Access Checks
     * @throws GraphQLError if not MENTOR or STAFF or on hold
     */
    approvedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(true)
      }),

    /**
     * Fetch all unapproved Access Checks
     * @returns all unapproved Access Checks
     * @throws GraphQLError if not MENTOR or STAFF or on hold
     */
    unapprovedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(false)
      }),
  },

  Mutation: {
    /**
     * Set an Access Check as approved
     * @argument id ID of Access Check to modify
     * @returns updated Access Check
     * @throws GraphQLError if not MENTOR or STAFF or or hold or if invalid id provided
     */
    approveAccessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const check = await getAccessCheckByID(args.id);
        if (!check) throw new GraphQLError("Access Check does not exist");
        const equipment = await EquipmentRepo.getEquipmentByID(check?.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        const affectedUser = await getUserByID(check.userID);
        if (!affectedUser) throw new GraphQLError("User does not exist");
        await createLog(`{user} approved the {equipment} access check for {user}`, `admin`,
          { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name }, { id: affectedUser.id, label: getUsersFullName(affectedUser) });
        return await setAccessCheckApproval(args.id, true);
      }),

    /**
     * Set an Access Check as not approved
     * @argument id ID of Access Check to modify
     * @returns updated Access Check
     * @throws GraphQLError if not MENTOR or STAFF or or hold or if invalid id provided
     */
    unapproveAccessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const check = await getAccessCheckByID(args.id);
        if (!check) throw new GraphQLError("Access Check does not exist");
        const equipment = await EquipmentRepo.getEquipmentByID(check?.equipmentID);
        if (!equipment) throw new GraphQLError("Equipment does not exist");
        const affectedUser = await getUserByID(check.userID);
        if (!affectedUser) throw new GraphQLError("User does not exist");
        await createLog(`{user} unapproved the {equipment} access check for {user}`, `admin`,
          { id: user.id, label: getUsersFullName(user) }, { id: equipment.id, label: equipment.name }, { id: affectedUser.id, label: getUsersFullName(affectedUser) });
        return await setAccessCheckApproval(args.id, false);
      }),

    /**
     * Create a new Access Check
     * @argument userID id of affected User
     * @argument equipmentID id of affected equipment
     * @returns new Access Check
     * @throws GraphQLError if not MENTOR or STAFF or or hold
     */
    createAccessCheck: async (
      _parent: any,
      args: { userID: number, equipmentID: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        const result = await createAccessCheck(args.userID, args.equipmentID);
        return true;
      }
      ),

    /**
     * Purge all unapproved access checks for a specified user and fetch new ones based on ccompleted trainings
     * @argument userID id of user to filter by
     * @returns void
     * @throws GraphQLError if not MENTOR or STAFF or or hold
     */
    refreshAccessChecks: async (
      _parent: any,
      args: { userID: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const equipmentToCheck = await EquipmentRepo.getEquipment();
        equipmentToCheck.forEach(async (equipment) => {
          await purgeUnapprovedAccessChecks(args.userID);
          if (!equipment.archived && !(await accessCheckExists(args.userID, equipment.id)) && ((await EquipmentRepo.getModulesByEquipment(equipment.id)).length == 0 || (await EquipmentRepo.UserIdHasTrainingModules(args.userID, equipment.id)))) {
            await createAccessCheck(args.userID, equipment.id);
          }
        });
      }
      ),

  }
};

export default AccessChecksResolver;