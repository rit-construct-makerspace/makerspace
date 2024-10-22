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
    tag1: MaintenanceTag,
    tag2: MaintenanceTag,
    tag3: MaintenanceTag
};

export interface MaintenanceTag {
  id: number,
  label: string,
  color: string,
}



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
        tag1 {
          id
          color
          label
        }
        tag2 {
          id
          color
          label
        }
        tag3 {
          id
          color
          label
        }
      }
    }
`;

export const GET_RESOLUTION_LOGS = gql`
    query GetResolutionLogsByEquipment($equipmentID: ID!) {
      getResolutionLogsByEquipment(equipmentID: $equipmentID) {
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
        tag1 {
          id
          color
          label
        }
        tag2 {
          id
          color
          label
        }
        tag3 {
          id
          color
          label
        }
      }
    }
`;

export const DELETE_MAINTENANCE_LOG = gql`
  mutation DeleteMaintenanceLog($id: ID!) {
    deleteMaintenanceLog(id: $id)
  }
`;

export const DELETE_RESOLUTION_LOG = gql`
  mutation DeleteResolutionLog($id: ID!) {
    deleteResolutionLog(id: $id)
  }
`;

export const CREATE_MAINTENANCE_LOG = gql`
  mutation CreateMaintenanceLog($equipmentID: ID!, $content: String!) {
    createMaintenanceLog(equipmentID: $equipmentID, content: $content) {
      id
    }
  }
`;

export const CREATE_RESOLUTION_LOG = gql`
  mutation CreateResolutionLog($equipmentID: ID!, $content: String!) {
    createResolutionLog(equipmentID: $equipmentID, content: $content) {
      id
    }
  }
`;

export const ADD_TAG_TO_LOG = gql`
  mutation AddTagToLog($logId: ID!, $tagId: ID!, $logType: String!) {
    addTagToLog(logId: $logId, tagId: $tagId, logType: $logType) {
      id
    }
  }
`;

export const REMOVE_TAG_FROM_LOG = gql`
  mutation RemoveTagFromLog($logId: ID!, $tagId: ID!, $logType: String!) {
    removeTagFromLog(logId: $logId, tagId: $tagId, logType: $logType) {
      id
    }
  }
`;

export const GET_MAINTENANCE_TAGS = gql`
    query GetMaintenanceTags {
      getMaintenanceTags {
        id
        label
        color
      }
    }
`;

export const DELETE_MAINTENANCE_TAG = gql`
  mutation DeleteMaintenanceTag($id: ID!) {
    deleteMaintenanceTag(id: $id)
  }
`;

export const CREATE_MAINTENANCE_TAG = gql`
  mutation CreateMaintenanceTag($label: String!, $color: String) {
    createMaintenanceTag(label: $label, color: $color) {
      id
    }
  }
`;

export const UPDATE_MAINTENANCE_TAG = gql`
  mutation UpdateMaintenanceTag($id: ID!, $label: String, $color: String) {
    updateMaintenanceTag(id: $id, label: $label, color: $color) {
      id
    }
  }
`;