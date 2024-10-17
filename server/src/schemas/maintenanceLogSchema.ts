import { gql } from "graphql-tag";

export const MaintenanceLogsTypeDefs = gql`
  scalar DateTime

  type MaintenanceLog {
    id: ID
    author: User!
    equipment: Equipment!
    timestamp: DateTime
    content: String
  }

  extend type Query {
    getMaintenanceLogsByEquipment(equipmentID: ID!): [MaintenanceLog]
  }

  extend type Mutation {
    createMaintenanceLog(equipmentID: ID!, content: String!): MaintenanceLog
    deleteMaintenanceLog(id: ID!): Boolean
  }
`;
