import { gql } from "@apollo/client";

export const GET_EQUIPMENTS = gql`
  query GetEquipment {
    equipments {
      id
      name
      archived
    }
  }
`;

export const GET_EQUIPMENT_BY_ID = gql`
  query GetEquipment($id: ID!) {
    equipment(id: $id) {
      id
      name
      archived
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
    }
  }
`;

export const GET_ANY_EQUIPMENT_BY_ID = gql`
  query GetAnyEquipment($id: ID!) {
    anyEquipment(id: $id) {
      id
      name
      archived
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
    }
  }
`;

export const GET_ARCHIVED_EQUIPMENTS = gql`
  query GetArchivedEquipment {
    archivedEquipments {
      id
      name
      archived
    }
  }
`;

export const GET_ARCHIVED_EQUIPMENT_BY_ID = gql`
  query GetArchivedEquipment($id: ID!) {
    archivedEquipment(id: $id) {
      id
      name
      archived
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
    }
  }
`;

export const GET_RESERVABLE_EQUIPMENT_FOR_MODULE = gql`
  query GetReservableEquipment($moduleID: ID!) {
    module(id: $moduleID) {
      id
      equipment {
        id
        name
      }
    }
  }
`;

export const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment(
    $id: ID!
    $name: String!
    $roomID: ID!
    $moduleIDs: [ID]!
  ) {
    updateEquipment(
      id: $id
      equipment: { name: $name, roomID: $roomID, moduleIDs: $moduleIDs }
    ) {
      id
    }
  }
`;

export const ARCHIVE_EQUIPMENT = gql`
  mutation ArchiveEquipment($id: ID!) {
    archiveEquipment(id: $id) {
      id
    }
  }
`;

export const PUBLISH_EQUIPMENT = gql`
  mutation ArchiveEquipment($id: ID!) {
    publishEquipment(id: $id) {
      id
    }
  }
`;

export const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment($name: String!, $roomID: ID!, $moduleIDs: [ID]!) {
    addEquipment(
      equipment: { name: $name, roomID: $roomID, moduleIDs: $moduleIDs }
    ) {
      id
    }
  }
`;


export default GET_EQUIPMENTS;
