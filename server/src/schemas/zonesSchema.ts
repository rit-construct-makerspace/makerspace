import { gql } from "graphql-tag";
import { ZoneHoursRow } from "../db/tables.js";

export const ZonesTypeDefs = gql`
  type Zone {
    id: ID!
    name: String!
    rooms: [Room]
    hours: [ZoneHours]
  }

  extend type Query {
    zones: [Zone]
  }

  extend type Mutation {
    deleteZone(id: ID!): Zone
    addZone(name: String!): Zone
  }
`;