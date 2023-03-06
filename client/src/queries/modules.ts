import { gql } from "@apollo/client";

export const GET_MODULE = gql`
  query GetModule($id: ID!) {
    module(id: $id) {
      id
      name
      quiz
      reservationPrompt
    }
  }
`;

export const GET_TRAINING_MODULES = gql`
  query GetTrainingModules {
    modules {
      id
      name
    }
  }
`;

export const UPDATE_MODULE = gql`
  mutation UpdateModule($id: ID!, $name: String!, $quiz: JSON!, $reservationPrompt: JSON) {
    updateModule(id: $id, name: $name, quiz: $quiz, reservationPrompt: $reservationPrompt) {
      id
    }
  }
`;

export const ARCHIVE_MODULE = gql`
  mutation ArchiveModule($id: ID!) {
    archiveModule(id: $id) {
      id
    }
  }
`;

export default GET_TRAINING_MODULES;
