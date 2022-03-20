import { gql } from "apollo-server-express";

export interface AuditLog {
  id: string;
  dateTime: string;
  message: string;
}

export const AuditLogsTypeDefs = gql`
  scalar DateTime

  type AuditLog {
    id: ID!
    dateTime: DateTime!
    message: String
  }

  extend type Query {
    auditLogs(
      startDate: DateTime
      stopDate: DateTime
      searchText: String
    ): [AuditLog]
  }
`;
