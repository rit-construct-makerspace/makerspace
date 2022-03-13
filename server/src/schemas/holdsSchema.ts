import { gql } from "apollo-server-express";

export interface Hold {
  id: number;
  description: String;
}

export const HoldsTypeDefs = gql`
  enum HoldType {
    INCOMPLETE_TRAINING
    SAFETY_VIOLATION
    BALANCE_DUE
  }

  type Hold {
    id: ID!
    type: HoldType!
    description: String
    createdBy: User!
    createdAt: DateTime
    removedAt: DateTime
    userId: User!
  }

  input HoldInput {
    id: Int!
    type: HoldType!
    description: String
    createdBy: Int!
    createdAt: DateTime
    removedAt: DateTime
    userId: Int!
  }

  type Query {
    holds: [Hold]
  }
`;
