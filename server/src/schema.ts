import {
  DateTimeResolver,
  DateTimeTypeDefinition,
  JSONResolver,
} from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { AnnouncementsTypeDefs } from "./schemas/announcementsSchema.js"; 
import { mergeResolvers } from "@graphql-tools/merge";
import { TrainingModuleTypeDefs } from "./schemas/trainingModuleSchema.js";
import { TrainingSubmissionTypeDefs } from "./schemas/trainingSubmissionSchema.js";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema.js";
import { ReservationsTypeDefs } from "./schemas/reservationsSchema.js";
import { UsersTypeDefs } from "./schemas/usersSchema.js";
import { HoldsTypeDefs } from "./schemas/holdsSchema.js";
import { EquipmentTypeDefs } from "./schemas/equipmentSchema.js";
import { RoomTypeDefs } from "./schemas/roomsSchema.js";
import { AuditLogsTypeDefs } from "./schemas/auditLogsSchema.js";
import { CalendarEventsTypeDefs } from "./schemas/calendarEventsSchema.js";
import trainingModuleResolvers from "./resolvers/trainingModuleResolver.js";
import trainingSubmissionsResolvers from "./resolvers/trainingSubmissionResolver.js";
import storefrontResolvers from "./resolvers/storeFrontResolver.js";
import roomsResolver from "./resolvers/roomsResolver.js";
import EquipmentResolvers from "./resolvers/equipmentResolver.js";
import usersResolver from "./resolvers/usersResolver.js";
import auditLogsResolver from "./resolvers/auditLogsResolver.js";
import holdsResolver from "./resolvers/holdsResolver.js";
import calendarEventsResolver from "./resolvers/calendarEventsResolver.js";
import AnnouncementsResolver from "./resolvers/announcementsResolver.js";
import { ReaderTypeDefs } from "./schemas/readersSchema.js";
import ReadersResolver from "./resolvers/readersResolver.js";
import { AccessCheckTypeDefs } from "./schemas/accessChecksSchema.js";
import AccessChecksResolver from "./resolvers/accessChecksResolver.js";

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
    TrainingModuleTypeDefs,
    TrainingSubmissionTypeDefs,
    StoreFrontTypeDefs,
    ReservationsTypeDefs,
    DateTimeTypeDefinition,
    RoomTypeDefs,
    AuditLogsTypeDefs,
    CalendarEventsTypeDefs,
    AnnouncementsTypeDefs,
    ReaderTypeDefs,
    AccessCheckTypeDefs
  ],
  resolvers: mergeResolvers([ //resolvers might be marked as "not assignable". Ignore it - NPM issue
    resolveFunctions,
    EquipmentResolvers,
    trainingModuleResolvers,
    trainingSubmissionsResolvers,
    storefrontResolvers,
    roomsResolver,
    usersResolver,
    holdsResolver,
    auditLogsResolver,
    calendarEventsResolver,
    AnnouncementsResolver,
    ReadersResolver,
    AccessChecksResolver
  ]),
});
