import { gql } from "apollo-server-express";

export const AuditLogsTypeDefs = gql`
  type Log {
    id: ID!
    timeDate: DateTime!
    user: User!
    eventType: EventType!
    description: String
  }

  enum EventType{
    DATABASE_MODIFICATION
    PURCHASE_ORDERS
    RESERVATIONS
    TRAINING
    INVENTORY_MANAGEMENT
    TRAINING_MANAGEMENT
    EQUIPMENT_MANAGEMENT
    USER_MANAGEMENT
  }

  input LogInput {
    timeDate: DateTime!
    user: User!
    eventType: EventType!
    description: String
  }
  
  type Query {
    auditLogs: [Log]
    auditLog(logID: ID!): Log
    auditLogsByUser(user: User!): [Log]
    auditLogsByEventType(eventType: EventType!): [Log]
    auditLogsByDate(startDate: DateTime!, endDate: DateTime!): [Log]
  }

  type Mutation {
    addLog(log: LogInput): Log
    
    modifyLogDescription(logID: ID!, description: String): Log
    
    deleteLog(logID: ID!): Log
  }
`;
