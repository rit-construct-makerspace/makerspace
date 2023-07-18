import { ApolloContext } from "../context";
import * as availabilityRepo from "../repositories/Availability/availabilityRepo";

const AvailabilityResolver = {
    Query : {
        availabilitySlots: async ( parent: any, args: { date: string, userID: number }, context: any ) => {
            return await availabilityRepo.getAllAvailability(args.date, args.userID);
        }
    },

    Mutation : {
        createAvailabilitySlot: async ( parent: any, args: {date: Date, startTime: Date, endTime: Date, userID: number}, { ifAllowed }: ApolloContext) => {
            return await availabilityRepo.createAvailabilitySlot(args.date, args.startTime, args.endTime, args.userID)
        }
    }
}

export default AvailabilityResolver;