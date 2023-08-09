import { ApolloContext } from "../context";
import * as availabilityRepo from "../repositories/Availability/availabilityRepo";
import {AvailabilityInput} from "../schemas/availabilitySchema";
import {Privilege} from "../schemas/usersSchema";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";

const AvailabilityResolver = {
    Query : {
        availabilityByDateAndUser: async ( parent: any, args: { date: string, userID: number }, context: any ) => {
            return await availabilityRepo.getAvailabilityByDateAndUser(args.date, args.userID);
        },
        availabilityByDate: async ( parent: any, args: { date: string }, context: any )=> {
            return await availabilityRepo.getAvailabilityByDate(args.date);
        }
    },

    Mutation : {
        createAvailabilitySlot: async (
            parent: any,
            args: { input: AvailabilityInput },
            { ifAllowed }: ApolloContext
        ) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await availabilityRepo.createAvailabilitySlot(args.input);
        }),

        updateAvailabilitySlot: async(
            parent: any,
            args: { id: string, input: AvailabilityInput },
            { ifAllowed }: ApolloContext
        ) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await availabilityRepo.updateAvailabilitySlot(args.id, args.input);
        }),

        deleteAvailabilitySlot: async(
            parent: any,
            args: { id: string },
            { ifAllowed }: ApolloContext
        ) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await availabilityRepo.deleteAvailabilitySlot(args.id);
        }),
    },
}

export default AvailabilityResolver;