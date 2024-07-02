import { gql } from "@apollo/client";
import Privilege from "../types/Privilege";

export interface PartialUser {
  id: number;
  ritUsername: string;
  firstName: string;
  lastName: string;
  privilege: Privilege;
  setupComplete?: boolean;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      ritUsername
      firstName
      lastName
      privilege
    }
  }
`;

export default GET_USERS;
