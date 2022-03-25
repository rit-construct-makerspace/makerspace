import { gql } from "apollo-server-express";

export const HoldsTypeDefs = gql`
  type Hold {
    id: ID!
    userID: User!
    description: String
    active: Boolean
  }

  input HoldInput {
    userID: Int!
    description: String
    active: Boolean
  }

  type Query {
    holds: [Hold]
    holdsByUser(userID: ID!): [Hold]
  }

  type Mutation {
    createHold(holdInput: HoldInput): Hold
    removeHold(id: ID!): Hold
  }
`;
