import { gql } from "@apollo/client";
import Privilege from "../types/Privilege";

export interface PartialUser {
  id: number;
  ritUsername: string;
  firstName: string;
  lastName: string;
  privilege: Privilege;
  setupComplete?: boolean;
  holds?: {id: number}[];
}

const GET_USERS = gql`
  query GetUsers($searchText: String) {
    users(searchText: $searchText) {
      id
      ritUsername
      firstName
      lastName
      privilege
    }
  }
`;

export const GET_USERS_LIMIT = gql`
  query GetUsers($searchText: String) {
    usersLimit(searchText: $searchText) {
      id
      ritUsername
      firstName
      lastName
      privilege
      holds {
        id
      }
    }
  }
`;

export const GET_NUM_USERS = gql`
  query NumUsers {
    numUsers {
      count
    }
  }
`;

export default GET_USERS;
