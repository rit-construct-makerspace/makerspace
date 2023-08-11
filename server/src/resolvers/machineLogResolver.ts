import { ApolloContext } from "../context";
import * as machineLogRepo from "../repositories/machineLogRepo";
import {MachineLogInput} from "../schemas/machineLogSchema";
import {Privilege} from "../schemas/usersSchema";

const AvailabilityResolver = {
    Query : {
        machineLogsByMachine: async (
            parent: any,
            args: { machineID: number },
            {ifAllowed}: ApolloContext
        ) => {
            return await machineLogRepo.getMachineLogsByMachine(args.machineID);
        },

        machineLogsByUser: async (
            parent: any,
            args: { userID: number },
            {ifAllowed}: ApolloContext
        )=> {
            return await machineLogRepo.getMachineLogsByUser(args.userID);
        }
    },

    Mutation : {
        createMachineLog: async (
            parent: any,
            args: { input: MachineLogInput },
            { ifAllowed }: ApolloContext
        ) =>
            ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
                return await machineLogRepo.createMachineLog(args.input);
            })
    },
}

export default AvailabilityResolver;