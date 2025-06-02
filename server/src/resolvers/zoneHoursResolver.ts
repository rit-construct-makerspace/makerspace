import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { createZoneHours, deleteZoneHours, getZoneHours, getHoursByZone } from "../repositories/Zones/ZoneHoursRepository.js";

const ZoneHoursResolver = {

  Query: {
    /**
     * Fetch all ZoneHours
     * @returns array of ZoneHours
     * @throws GraphQLError if not MAKER, MENTOR, or STAFF or is on hold
     */
    zoneHours: async (
      _parent: any,
      _args: any,
      { }: ApolloContext) => {
        return await getZoneHours();
      },

    /**
     * Fetch all ZoneHours for a specified Zone
     * @argument zoneID ID of Zone to filter by
     * @returns array of ZoneHours
     * @throws GraphQLError if not MAKER, MENTOR, or STAFF or is on hold
     */
    zoneHoursByZone: async (
      _parent: any,
      args: { zoneID: string },
      { }: ApolloContext) => {
        return await getHoursByZone(Number(args.zoneID));
      },
  },

  Mutation: {
    /**
     * Create a ZoneHours entry
     * @argument zoneID ID of the Zone the entry applies to
     * @argument type Entry type string (ex: "OPEN", "CLOSE")
     * @argument dayOfTheWeek Integer representation of the day of the week the entry applies to (1-7)
     * @argument time Colon seperated time string (ex: 08:00:00)
     * @returns ZoneHours entry
     * @throws GraphQLError if not STAFF or is on hold
     */
    addZoneHours: async (
      _parent: any,
      args: { zoneID: string, type: string, dayOfTheWeek: string, time: string },
      { isManager }: ApolloContext) =>
      isManager(async () => {
        const time = args.time.replace(":", "") + "00";
        //console.log(`${args.zone}, ${args.type}, ${(args.dayOfTheWeek)}, ${time}`)
        return await createZoneHours(Number(args.zoneID), args.type, Number(args.dayOfTheWeek), time);
      }),

    /**
     * Delete a ZoneHours entry
     * @argument id of the entry to delete
     * @returns true
     * @throws GraphQLError if not STAFF or is on hold
     */
    deleteZoneHours: async (
      _parent: any,
      args: { id: number },
      { isManager }: ApolloContext) =>
      isManager(async () => {
        await deleteZoneHours(args.id);
        return (await getZoneHours())[0];
      }),
  }
};

export default ZoneHoursResolver;