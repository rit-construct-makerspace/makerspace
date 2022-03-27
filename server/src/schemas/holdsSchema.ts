import { gql } from "apollo-server-express";
import { User } from "./usersSchema";

export interface Hold {
  id: number;
  user: User;
  description: string;
  active: boolean;
}

export interface HoldInput {
  user: number;
  description: string;
}

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
  }
`;
