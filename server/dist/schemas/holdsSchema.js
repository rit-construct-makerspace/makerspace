"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldsTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.HoldsTypeDefs = (0, graphql_tag_1.gql) `
  type Hold {
    id: ID!
    creator: User!
    remover: User
    user: User!
    description: String!
    createDate: DateTime!
    removeDate: DateTime
  }

  input HoldInput {
    userID: ID!
    description: String
  }

  extend type Mutation {
    createHold(userID: ID!, description: String!): Hold
    removeHold(holdID: ID!): Hold
  }
`;
//# sourceMappingURL=holdsSchema.js.map