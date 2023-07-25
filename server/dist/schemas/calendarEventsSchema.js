"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventsTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.CalendarEventsTypeDefs = (0, graphql_tag_1.gql) `
  type CalendarEvent {
    id: ID
    status: String
    summary: String
    description: String
    location: String
    startTime: String
    endTime: String
  }

  extend type Query {
    calendarEvents(timeMin: String!, maxResults: Int!): [CalendarEvent]
  }
`;
//# sourceMappingURL=calendarEventsSchema.js.map