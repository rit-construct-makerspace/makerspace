import { gql } from "apollo-server-express";

export const AuditLogsTypeDefs = gql`
  type Log {
    id: ID!
    timeDate: Date!
    user: User!
    eventType: EventType!
    Description: String!
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
    timeDate: Date!
    user: User!
    eventType: EventType!
    Description: String!
  }

  type Mutation {
    addLog(log: LogInput): Log
    
    modifyLogDescription(logID: ID!, description: String): Log
    
    deleteLog(logID: ID!): Log
  }
`;
