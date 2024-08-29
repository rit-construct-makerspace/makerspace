import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { createZoneHours, deleteZoneHours, getHoursByZone, getZoneHours } from "../repositories/Zones/ZoneHoursRepository.js";
import { createZone, deleteZone, getZones } from "../repositories/Zones/ZonesRespository.js";
import { ZoneRow } from "../db/tables.js";
import { getRooms, getRoomsByZone } from "../repositories/Rooms/RoomRepository.js";

const ZonesResolver = {
  Zone: {
    rooms: async (
      parent: ZoneRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
        return getRoomsByZone(parent.id);
      }
    ),
    hours: async (
      parent: ZoneRow,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
        return getHoursByZone(parent.id);
      }
    ),
  },

  Query: {
    zones: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getZones();
      }),
  },

  Mutation: {
    addZone: async (
      _parent: any,
      args: { name: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        const res = await createZone(args.name);
        return res
      }),

    deleteZone: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        await deleteZone(args.id);
        return (await getZones())[0];
      }),
  }
};

export default ZonesResolver;