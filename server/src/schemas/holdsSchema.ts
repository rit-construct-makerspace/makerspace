import { gql } from "apollo-server-express";

export const MachinesTypeDefs = gql`

  enum HoldType {
    INCOMPLETE_TRAINING
    SAFETY_VIOLATION
    BALANCE_DUE
  }

  type Hold {
    id: ID!
    type: HoldType!
    description: String
    createdOn: Date
    removedOn: Date
    userId: User!
  }

  input HoldInput {
    id: Int!
    type: HoldType!
    description: String
    createdOn: Date
    removedOn: Date
    userId: Int!
  }

  type Query {
      holds: [Hold]
  }

  type Mutation {
    placeHold(hold: HoldInput): Hold
    removeHold(holdId: ID!): Hold
  }
`;
