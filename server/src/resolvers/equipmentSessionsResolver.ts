import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getAccessCheckByID, getAccessChecks, getAccessChecksByApproved, setAccessCheckApproval } from "../repositories/Equipment/AccessChecksRepository.js";
import { getUserByID } from "../repositories/Users/UserRepository.js";
import { getEquipmentSessions } from "../repositories/Equipment/EquipmentSessionsRepository.js";
import { getRoomByID } from "../repositories/Rooms/RoomRepository.js";
import { getZoneByID } from "../repositories/Zones/ZonesRespository.js";

const EquipmentSessionsResolver = {
  EquipmentSession: {
    user: async (
      parent: { userID: string },
      _args: any,
      _context: ApolloContext) => {
      return getUserByID(Number(parent.userID));
    },
    equipment: async (
      parent: { equipmentID: string },
      _args: any,
      _context: ApolloContext) => {
      if (parent.equipmentID == null || parent.equipmentID == "" || Number(parent.equipmentID) == 0) return null;
      return EquipmentRepo.getEquipmentByID(Number(parent.equipmentID));
    },
    room: async (
      parent: { equipmentID: string },
      _args: any,
      _context: ApolloContext) => {
      if (parent.equipmentID == null || parent.equipmentID == "" || Number(parent.equipmentID) == 0) return null;
      return getRoomByID((await EquipmentRepo.getEquipmentByID(Number(parent.equipmentID))).roomID)
    },
    zone: async (
      parent: { equipmentID: string },
      _args: any,
      _context: ApolloContext) => {
      if (parent.equipmentID == null || parent.equipmentID == "" || Number(parent.equipmentID) == 0) return null;
      const zoneID = (await getRoomByID((await EquipmentRepo.getEquipmentByID(Number(parent.equipmentID))).roomID))?.zoneID;

      if (!zoneID) return null;
      else return getZoneByID(zoneID);
    },
  },

  Query: {
    equipmentSessions: async (
      _parent: any,
      args: {startDate: string, stopDate: string},
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getEquipmentSessions();
      }),
  },

  Mutation: {
  }
};

export default EquipmentSessionsResolver;