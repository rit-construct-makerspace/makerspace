"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_scalars_1 = require("graphql-scalars");
const schema_1 = require("@graphql-tools/schema");
const announcementsSchema_1 = require("./schemas/announcementsSchema");
const merge_1 = require("@graphql-tools/merge");
const trainingModuleSchema_1 = require("./schemas/trainingModuleSchema");
const trainingSubmissionSchema_1 = require("./schemas/trainingSubmissionSchema");
const storeFrontSchema_1 = require("./schemas/storeFrontSchema");
const reservationsSchema_1 = require("./schemas/reservationsSchema");
const usersSchema_1 = require("./schemas/usersSchema");
const holdsSchema_1 = require("./schemas/holdsSchema");
const equipmentSchema_1 = require("./schemas/equipmentSchema");
const roomsSchema_1 = require("./schemas/roomsSchema");
const auditLogsSchema_1 = require("./schemas/auditLogsSchema");
const calendarEventsSchema_1 = require("./schemas/calendarEventsSchema");
const trainingModuleResolver_1 = __importDefault(require("./resolvers/trainingModuleResolver"));
const trainingSubmissionResolver_1 = __importDefault(require("./resolvers/trainingSubmissionResolver"));
const storeFrontResolver_1 = __importDefault(require("./resolvers/storeFrontResolver"));
const roomsResolver_1 = __importDefault(require("./resolvers/roomsResolver"));
const equipmentResolver_1 = __importDefault(require("./resolvers/equipmentResolver"));
const usersResolver_1 = __importDefault(require("./resolvers/usersResolver"));
const auditLogsResolver_1 = __importDefault(require("./resolvers/auditLogsResolver"));
const holdsResolver_1 = __importDefault(require("./resolvers/holdsResolver"));
const calendarEventsResolver_1 = __importDefault(require("./resolvers/calendarEventsResolver"));
const announcementsResolver_1 = __importDefault(require("./resolvers/announcementsResolver"));
const resolveFunctions = {
    DateTime: graphql_scalars_1.DateTimeResolver,
    JSON: graphql_scalars_1.JSONResolver,
};
exports.schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: [
        usersSchema_1.UsersTypeDefs,
        holdsSchema_1.HoldsTypeDefs,
        equipmentSchema_1.EquipmentTypeDefs,
        trainingModuleSchema_1.TrainingModuleTypeDefs,
        trainingSubmissionSchema_1.TrainingSubmissionTypeDefs,
        storeFrontSchema_1.StoreFrontTypeDefs,
        reservationsSchema_1.ReservationsTypeDefs,
        graphql_scalars_1.DateTimeTypeDefinition,
        roomsSchema_1.RoomTypeDefs,
        auditLogsSchema_1.AuditLogsTypeDefs,
        calendarEventsSchema_1.CalendarEventsTypeDefs,
        announcementsSchema_1.AnnouncementsTypeDefs
    ],
    resolvers: (0, merge_1.mergeResolvers)([
        resolveFunctions,
        equipmentResolver_1.default,
        trainingModuleResolver_1.default,
        trainingSubmissionResolver_1.default,
        storeFrontResolver_1.default,
        roomsResolver_1.default,
        usersResolver_1.default,
        holdsResolver_1.default,
        auditLogsResolver_1.default,
        calendarEventsResolver_1.default,
        announcementsResolver_1.default
    ]),
});
//# sourceMappingURL=schema.js.map