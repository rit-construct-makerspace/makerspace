import { gql } from "graphql-tag";
import { ZoneHoursRow } from "../db/tables.js";

export const ZoneHoursTypeDefs = gql`
  type ZoneHours {
    id: ID!
    zoneID: ID!
    type: String!
    dayOfTheWeek: String!
    time: String!
  }

  extend type Query {
    zoneHours: [ZoneHours]
    zoneHoursByZone(zoneID: ID!): [ZoneHours]
  }

  extend type Mutation {
    deleteZoneHours(id: ID!): ZoneHours
    addZoneHours(zoneID: ID!, type: String!, dayOfTheWeek: String!, time: String!): ZoneHours
  }
`;