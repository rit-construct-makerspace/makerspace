import { gql } from "@apollo/client";

export enum InstanceStatus {
    UNDEPLOYED = "UNDEPLOYED",
    ACTIVE = "ACTIVE",
    NEEDS_REPAIRS = "NEEDS REPAIRS",
    UNDER_REPAIRS = "UNDER REPAIRS",
    TESTING = "TESTING",
    RETIRED = "RETIRED"
}

export interface EquipmentInstance {
    id: number;
    equipment: {
        id: number;
        name: string;
    }
    name: string;
    status: InstanceStatus;
}

export const GET_EQUIPMENT_INSTANCES = gql`
  query EquipmentInstances($equipmentID: ID!) {
    equipmentInstances(equipmentID: $equipmentID) {
      id
      equipment {
        id
        name
      }
      name
      status
    }
  }
`;

export const CREATE_EQUIPMENT_INSTANCE = gql`
    mutation CreateEquipmentinstance($equipmentID: ID!, $name: String!) {
        createEquipmentinstance(equipmentID: $equipmentID, name: $name) {
            id
        }
    }
`;

export const SET_INSTANCE_STATUS = gql`
    mutation SetInstanceStatus($id: ID!, $status: String!) {
        setInstanceStatus(id: $id, status: $status) {
            id
        }
    }
`;

export const SET_INSTANCE_NAME = gql`
    mutation SetInstanceName($id: ID!, $name: String!) {
        setInstanceName(id: $id, name: $name) {
            id
        }
    }
`;

export const DELETE_EQUIPMENT_INSTANCE = gql`
    mutation DeleteInstance($id: ID!) {
        deleteInstance(id: $id)
    }
`;