import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "@graphql-tools/merge";
import { TrainingTypeDefs } from "./schemas/trainingSchema";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema";
import { ReservationsTypeDefs } from "./schemas/reservationsSchema";
import { UsersTypeDefs } from "./schemas/usersSchema";
import { HoldsTypeDefs } from "./schemas/holdsSchema";
import { EquipmentTypeDefs } from "./schemas/equipmentSchema";
import { RoomTypeDefs } from "./schemas/roomsSchema";
import {
  DateTimeResolver,
  DateTimeTypeDefinition,
  JSONResolver,
} from "graphql-scalars";
import { AuditLogsTypeDefs } from "./schemas/auditLogsSchema";
import trainingResolvers from "./resolvers/trainingResolver";
import storefrontResolvers from "./resolvers/storeFrontResolver";
import roomsResolver from "./resolvers/roomsResolver";
import EquipmentResolvers from "./resolvers/equipmentResolver";
import usersResolver from "./resolvers/usersResolver";
import auditLogsResolver from "./resolvers/auditLogsResolver";
import holdsResolver from "./resolvers/holdsResolver";

// for custom scalars such as Date
const resolveFunctions = {
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
};

export const schema = makeExecutableSchema({
  typeDefs: [
    UsersTypeDefs,
    HoldsTypeDefs,
    EquipmentTypeDefs,
    TrainingTypeDefs,
    StoreFrontTypeDefs,
    ReservationsTypeDefs,
    DateTimeTypeDefinition,
    RoomTypeDefs,
    AuditLogsTypeDefs,
  ],
  resolvers: mergeResolvers([
    resolveFunctions,
    EquipmentResolvers,
    trainingResolvers,
    storefrontResolvers,
    roomsResolver,
    usersResolver,
    holdsResolver,
    auditLogsResolver,
  ]),
});
