import { gql } from "graphql-tag";
import { ZoneHoursRow } from "../db/tables.js";

export const ZoneHoursTypeDefs = gql`
  type ZoneHours {
    id: ID!
    zone: String!
    type: String!
    dayOfTheWeek: String!
    time: String!
  }

  extend type Query {
    zoneHours: [ZoneHours]
  }

  extend type Mutation {
    deleteZoneHours(id: ID!): ZoneHours
    addZoneHours(zone: String!, type: String!, dayOfTheWeek: String!, time: String!): ZoneHours
  }
`;