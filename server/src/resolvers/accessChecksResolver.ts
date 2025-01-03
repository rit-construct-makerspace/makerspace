import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { accessCheckExists, createAccessCheck, getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, purgeUnapprovedAccessChecks, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUserByID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { GraphQLError } from "graphql";
const AccessChecksResolver = {

  Query: {
    accessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecks();
      }),

    accessCheck: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessCheckByID(args.id)
      }),

    approvedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(true)
      }),

    unapprovedAccessChecks: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getAccessChecksByApproved(false)
      }),
  },

  Mutation: {
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

    createAccessCheck: async (
      _parent: any,
      args: { userID: number, equipmentID: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        const result = await createAccessCheck(args.userID, args.equipmentID);
        return true;
      }
      ),

    refreshAccessChecks: async (
      _parent: any,
      args: { userID: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const equipmentToCheck = await EquipmentRepo.getEquipment();
        equipmentToCheck.forEach(async (equipment) => {
          await purgeUnapprovedAccessChecks(args.userID);
          if (!equipment.archived && !(await accessCheckExists(args.userID, equipment.id)) && ((await EquipmentRepo.getModulesByEquipment(equipment.id)).length == 0 || (await EquipmentRepo.UserIdHasTrainingModules(args.userID, equipment.id)))) {
            console.log("create " + equipment.name)
            await createAccessCheck(args.userID, equipment.id);
          }
        });
      }
    ),

  }
};

export default AccessChecksResolver;