import { gql } from "@apollo/client";

export const GET_EQUIPMENTS = gql`
  query GetEquipment {
    equipments {
      id
      name
      archived
      imageUrl
      sopUrl
      trainingModules {
        id
        name
      }
      numAvailable
      numInUse
    }
  }
`;

export const GET_EQUIPMENT_BY_ID = gql`
  query GetEquipment($id: ID!) {
    equipment(id: $id) {
      id
      name
      archived
      imageUrl
      sopUrl
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
      notes
      numAvailable
      numInUse
    }
  }
`;

export const GET_ANY_EQUIPMENT_BY_ID = gql`
  query GetAnyEquipment($id: ID!) {
    anyEquipment(id: $id) {
      id
      name
      archived
      imageUrl
      sopUrl
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
      notes
      numAvailable
      numInUse
    }
  }
`;

export const GET_ARCHIVED_EQUIPMENTS = gql`
  query GetArchivedEquipment {
    archivedEquipments {
      id
      name
      archived
      imageUrl
      sopUrl
    }
  }
`;

export const GET_ARCHIVED_EQUIPMENT_BY_ID = gql`
  query GetArchivedEquipment($id: ID!) {
    archivedEquipment(id: $id) {
      id
      name
      archived
      imageUrl
      sopUrl
      room {
        id
        name
      }
      trainingModules {
        id
        name
      }
      notes
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
    $imageUrl: String!
    $sopUrl: String!
    $notes: String!
  ) {
    updateEquipment(
      id: $id
      equipment: { name: $name, roomID: $roomID, moduleIDs: $moduleIDs, imageUrl: $imageUrl, sopUrl: $sopUrl, notes: $notes }
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
  mutation CreateEquipment(
    $name: String!, 
    $roomID: ID!, 
    $moduleIDs: [ID]!,
    $imageUrl: String!
    $sopUrl: String!
    $notes: String!
    ) {
    addEquipment(
      equipment: { name: $name, roomID: $roomID, moduleIDs: $moduleIDs, imageUrl: $imageUrl, sopUrl: $sopUrl, notes: $notes }
    ) {
      id
    }
  }
`;


export default GET_EQUIPMENTS;
