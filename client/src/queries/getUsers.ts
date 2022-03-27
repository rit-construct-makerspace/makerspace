import { gql } from "@apollo/client";
import Privilege from "../types/Privilege";

export interface PartialUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  privilege: Privilege;
  setupComplete?: boolean;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      privilege
    }
  }
`;

export default GET_USERS;
