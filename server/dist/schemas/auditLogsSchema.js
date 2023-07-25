"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.AuditLogsTypeDefs = (0, graphql_tag_1.gql) `
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
//# sourceMappingURL=auditLogsSchema.js.map