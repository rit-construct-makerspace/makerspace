import { gql } from "apollo-server-express";

export const AuditLogsTypeDefs = gql`
  scalar DateTime

  type Log {
    id: ID!
    timeDate: DateTime!
    user: User!
    eventType: EventType!
    description: String
  }

  enum EventType {
    DATABASE_MODIFICATION
    RESERVATIONS
    TRAINING
    INVENTORY_MANAGEMENT
    TRAINING_MANAGEMENT
    EQUIPMENT_MANAGEMENT
    USER_MANAGEMENT
  }

  input LogInput {
    userID: Int!
    eventType: EventType!
    description: String
  }

  type Query {
    auditLogs: [Log]
    auditLog(logID: ID!): Log
    auditLogsByUser(userID: ID!): [Log]
    auditLogsByEventType(eventType: EventType!): [Log]
    auditLogsByDate(startDate: DateTime!, endDate: DateTime!): [Log]
  }

  type Mutation {
    addLog(log: LogInput): Log

    modifyLogDescription(logID: ID!, description: String): Log

    deleteLog(logID: ID!): Log
  }
`;
