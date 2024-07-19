import { gql } from "@apollo/client";
import Equipment from "../types/Equipment";

export interface Reader {
  id: number,
  machineID: string,
  machineType: string,
  name: string,
  zone: string
  temp: number,
  state: string,
  currentUID: string,
  recentSessionLength: number,
  lastStatusReason: string,
  scheduledStatusFreq: number,
  lastStatusTime: string
}

export const GET_READERS = gql`
  query GetReaders {
    readers {
      id
      machineID
      machineType
      name
      zone
      temp
      state
      currentUID
      recentSessionLength
      lastStatusReason
      scheduledStatusFreq
      lastStatusTime
    }
  }
`

export const GET_READER = gql`
  query GetReader($id: ID!) {
    reader(id: $id) {
      id
      machineID
      machineType
      name
      zone
      temp
      state
      currentUID
      recentSessionLength
      lastStatusReason
      scheduledStatusFreq
      lastStatusTime
    }
  }
`;

export const CREATE_READER = gql`
  mutation CreateReader(
    $id: ID!,
    $machineID: string,
    $machineType: string,
    $name: string,
    $zone: string,
  ) {
    createReader(
      id: $id,
      machineID: $machineID,
      machineType: $machineType,
      name: $name,
      zone: $zone,
    ) {
      id
      machineID
      machineType
      name
      zone
    }
  }
`;

export const SET_READER_NAME = gql`
  mutation SetReaderName($id: ID!, $name: string) {
    setName(id: $id, name: $name) {
      id
      machineID
      machineType
      name
      zone
      temp
      state
      currentUID
      recentSessionLength
      lastStatusReason
      scheduledStatusFreq
      lastStatusTime
    }
  }
`;