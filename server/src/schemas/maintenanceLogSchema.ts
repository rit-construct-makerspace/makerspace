import { gql } from "graphql-tag";

export const MaintenanceLogsTypeDefs = gql`
  scalar DateTime

  type MaintenanceLog {
    id: ID
    author: User!
    equipment: Equipment!
    instance: EquipmentInstance
    timestamp: DateTime
    content: String
    tag1: MaintenanceTag
    tag2: MaintenanceTag
    tag3: MaintenanceTag
  }

  type ResolutionLog {
    id: ID
    author: User!
    equipment: Equipment!
    instance: EquipmentInstance
    timestamp: DateTime
    content: String
    tag1: MaintenanceTag
    tag2: MaintenanceTag
    tag3: MaintenanceTag
  }

  type MaintenanceTag {
    id: ID
    equipment: Equipment
    label: String
    color: String
  }

  extend type Query {
    getMaintenanceLogsByEquipment(equipmentID: ID!): [MaintenanceLog]
    getResolutionLogsByEquipment(equipmentID: ID!): [ResolutionLog]
    getMaintenanceTags(equipmentID: ID): [MaintenanceTag]
    getMaintenanceTagByID(id: ID!): MaintenanceTag
  }

  extend type Mutation {
    createMaintenanceLog(equipmentID: ID!, instanceID: ID, content: String!): MaintenanceLog
    createResolutionLog(equipmentID: ID!, instanceID: ID, content: String!): ResolutionLog
    deleteMaintenanceLog(id: ID!): Boolean
    deleteResolutionLog(id: ID!): Boolean
    createMaintenanceTag(equipmentID: ID, label: String, color: String): MaintenanceTag
    deleteMaintenanceTag(id: ID!): Boolean
    updateMaintenanceTag(id: ID!, label: String, color: String): MaintenanceTag
    addTagToLog(logId: ID!, tagId: ID!, logType: String!): MaintenanceLog
    removeTagFromLog(logId: ID!, tagId: ID!, logType: String!): MaintenanceLog
  }
`;
