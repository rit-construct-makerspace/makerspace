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
    MANAGEMENT_INVENTORY
    MANAGEMENT_TRAINING
    MANAGEMENT_EQUIPMENT
    MANAGEMENT_RESERVATIONS
    MANAGEMENT_USERS
    INVENTORY_RESTOCK
    USER_PAYMENT
    TRAINING_QUIZ
    RESERVATIONS_MADE
    RESERVATIONS CANCELED
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
