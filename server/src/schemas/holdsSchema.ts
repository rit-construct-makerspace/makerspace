import { gql } from "apollo-server-express";

export interface Hold {
  id: number;
  creatorID: number;
  removerID?: number;
  userID: number;
  description: string;
  createDate: Date;
  removeDate?: Date;
}

export const HoldsTypeDefs = gql`
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
