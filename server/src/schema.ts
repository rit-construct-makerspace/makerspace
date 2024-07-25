import {
  DateTimeResolver,
  DateTimeTypeDefinition,
  JSONResolver,
} from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { AnnouncementsTypeDefs } from "./schemas/announcementsSchema"; 
import { mergeResolvers } from "@graphql-tools/merge";
import { TrainingModuleTypeDefs } from "./schemas/trainingModuleSchema";
import { TrainingSubmissionTypeDefs } from "./schemas/trainingSubmissionSchema";
import { StoreFrontTypeDefs } from "./schemas/storeFrontSchema";
import { ReservationsTypeDefs } from "./schemas/reservationsSchema";
import { UsersTypeDefs } from "./schemas/usersSchema";
import { HoldsTypeDefs } from "./schemas/holdsSchema";
import { EquipmentTypeDefs } from "./schemas/equipmentSchema";
import { RoomTypeDefs } from "./schemas/roomsSchema";
import { AuditLogsTypeDefs } from "./schemas/auditLogsSchema";
import { CalendarEventsTypeDefs } from "./schemas/calendarEventsSchema";
import trainingModuleResolvers from "./resolvers/trainingModuleResolver";
import trainingSubmissionsResolvers from "./resolvers/trainingSubmissionResolver";
import storefrontResolvers from "./resolvers/storeFrontResolver";
import roomsResolver from "./resolvers/roomsResolver";
import EquipmentResolvers from "./resolvers/equipmentResolver";
import usersResolver from "./resolvers/usersResolver";
import auditLogsResolver from "./resolvers/auditLogsResolver";
import holdsResolver from "./resolvers/holdsResolver";
import calendarEventsResolver from "./resolvers/calendarEventsResolver";
import AnnouncementsResolver from "./resolvers/announcementsResolver";
import { ReaderTypeDefs } from "./schemas/readersSchema";
import ReadersResolver from "./resolvers/readersResolver";
import { AccessCheckTypeDefs } from "./schemas/accessChecksSchema";
import AccessChecksResolver from "./resolvers/accessChecksResolver";

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
  resolvers: mergeResolvers([
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
