import { gql } from "@apollo/client";

export interface MaintenanceLogItem {
    id: number,
    timestamp: string,
    equipment: {
      id: number
    }
    author: {
        id: number,
        firstName: string,
        lastName: string
    }
    content: string
};

export const GET_MAINTENANCE_LOGS = gql`
    query GetMaintenanceLogsByEquipment($equipmentID: ID!) {
      getMaintenanceLogsByEquipment(equipmentID: $equipmentID) {
        id
        timestamp
        equipment {
          id
        }
        author {
          id
          firstName
          lastName
        }
        content
      }
    }
`;

export const DELETE_MAINTENANCE_LOG = gql`
  mutation DeleteMaintenanceLog($id: ID!) {
    deleteMaintenanceLog(id: $id)
  }
`;

export const CREATE_MAINTENANCE_LOG = gql`
  mutation CreateMaintenanceLog($equipmentID: ID!, $content: String!) {
    createMaintenanceLog(equipmentID: $equipmentID, content: $content) {
      id
    }
  }
`;