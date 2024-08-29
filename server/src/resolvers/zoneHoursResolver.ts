import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { createZoneHours, deleteZoneHours, getZoneHours, getHoursByZone } from "../repositories/Zones/ZoneHoursRepository.js";

const ZoneHoursResolver = {

  Query: {
    zoneHours: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getZoneHours();
      }),

      zoneHoursByZone: async (
        _parent: any,
        args: {zoneID: string},
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async () => {
          return await getHoursByZone(Number(args.zoneID));
        }),
  },

  Mutation: {
    addZoneHours: async (
      _parent: any,
      args: { zoneID: string, type: string, dayOfTheWeek: string, time: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        const time = args.time.replace(":", "") + "00";
        //console.log(`${args.zone}, ${args.type}, ${(args.dayOfTheWeek)}, ${time}`)
        return await createZoneHours(Number(args.zoneID), args.type, Number(args.dayOfTheWeek), time);
      }),

    deleteZoneHours: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        await deleteZoneHours(args.id);
        return (await getZoneHours())[0];
      }),
  }
};

export default ZoneHoursResolver;