import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
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
        equipment: async (
            parent: EquipmentInstancesRow,
            _args: any,
            _context: ApolloContext) => {
            return EquipmentRepo.getEquipmentByID(Number(parent.equipmentID));
        },
    },

    Query: {
        equipmentInstances: async (
            _parent: any,
            args: { equipmentID: number },
            { ifAllowed }: ApolloContext) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await getInstancesByEquipment(args.equipmentID)
            }),
    },

    Mutation: {
        createEquipmentinstance: async (
            _parent: any,
            args: { equipmentID: number, name: string },
            { ifAllowed }: ApolloContext) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
                const equipment = await EquipmentRepo.getEquipmentByID(args.equipmentID);
                if (!equipment) throw new GraphQLError("Equipment does not exist");
                await createLog(`{user} created instance "${args.name}" on {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: equipment.id, label: equipment.name});
                return await createInstance(args.equipmentID, args.name)
            }),
        setInstanceStatus: async (
            _parent: any,
            args: { id: number, status: string },
            { ifAllowed }: ApolloContext) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
                const orig = await getInstanceByID(args.id);
                if (!orig) throw new GraphQLError("Instance does not exist");
                const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
                if (!equipment) throw new GraphQLError("Equipment does not exist");
                await createLog(`{user} changed instance "${orig.name}" status to "${args.status}" on {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: equipment.id, label: equipment.name});
                return await setInstanceStatus(args.id, args.status)
            }),
        setInstanceName: async (
            _parent: any,
            args: { id: number, name: string },
            { ifAllowed }: ApolloContext) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
                const orig = await getInstanceByID(args.id);
                if (!orig) throw new GraphQLError("Instance does not exist");
                const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
                if (!equipment) throw new GraphQLError("Equipment does not exist");
                await createLog(`{user} changed instance "${orig.name}" name to "${args.name}" on {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: equipment.id, label: equipment.name});
                return await setInstanceName(args.id, args.name)
            }),
        deleteInstance: async (
            _parent: any,
            args: { id: number },
            { ifAllowed }: ApolloContext) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
                const orig = await getInstanceByID(args.id);
                if (!orig) throw new GraphQLError("Instance does not exist");
                const equipment = await EquipmentRepo.getEquipmentByID(orig.equipmentID);
                if (!equipment) throw new GraphQLError("Equipment does not exist");
                await createLog(`{user} deleted instance "${orig.name}" on {equipment}`, "admin", {id: user.id, label: getUsersFullName(user)}, {id: equipment.id, label: equipment.name});
                return await deleteInstance(args.id)
            }),
    }
};

export default EquipmentInstanceResolver;