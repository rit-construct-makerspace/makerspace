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

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      privilege
      setupComplete
      balance
      holds {
        removeDate
      }
      passedModules {
        moduleID
        submissionDate
        expirationDate
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      pronouns
      email
      college
      expectedGraduation
      registrationDate
      privilege
      holds {
        id
        creator {
          firstName
          lastName
        }
        remover {
          firstName
          lastName
        }
        createDate
        removeDate
        description
      }
    }
  }
`;

export const CREATE_HOLD = gql`
  mutation CreateHold($userID: ID!, $description: String!) {
    createHold(userID: $userID, description: $description) {
      id
    }
  }
`;

export const ARCHIVE_USER = gql`
  mutation ArchiveUser($userID: ID!) {
    archiveUser(userID: $userID) {
      id
    }
  }
`;

export const REMOVE_HOLD = gql`
  mutation RemoveHold($holdID: ID!) {
    removeHold(holdID: $holdID) {
      id
    }
  }
`;

export const SET_PRIVILEGE = gql`
  mutation SetPrivilege($userID: ID!, $privilege: Privilege) {
    setPrivilege(userID: $userID, privilege: $privilege) {
      id
    }
  }
`;

export const UPDATE_STUDENT_PROFILE = gql`
  mutation UpdateStudentProfile(
    $userID: ID!
    $pronouns: String
    $college: String
    $expectedGraduation: String
    $universityID: String
  ) {
    updateStudentProfile(
      userID: $userID
      pronouns: $pronouns
      college: $college
      expectedGraduation: $expectedGraduation
      universityID: $universityID
    ) {
      id
    }
  }
`;

export default GET_USERS;
