import { ApolloContext } from "../context";
import * as availabilityRepo from "../repositories/Availability/availabilityRepo";
import {AvailabilityInput} from "../schemas/availabilitySchema";
import {Privilege} from "../schemas/usersSchema";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";

const AvailabilityResolver = {
    Query : {
        availabilitySlots: async ( parent: any, args: { date: string, userID: number }, context: any ) => {
            return await availabilityRepo.getAllAvailability(args.date, args.userID);
        }
    },

    Mutation : {
        createAvailabilitySlot: async (
            parent: any,
            args: { availability: AvailabilityInput },
            { ifAllowed }: ApolloContext
        ) =>

            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await availabilityRepo.createAvailabilitySlot(args.availability);
            })
    },
}

export default AvailabilityResolver;