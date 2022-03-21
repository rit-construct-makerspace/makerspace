import { gql } from "apollo-server-express";

export const RoomTypeDefs = gql`
  type Room {
    id: ID!
    name: String!
    equipmentList: [Equipment]
    currentUsers: [User]
    labbies: [User]
  }

  input RoomInput {
    name: String!
  }

  type Query {
    rooms: [Room]
    room(roomID: ID!): Room
    roomByEquipment(equipmentID: ID!): Room
    roomByLabbie(labbieID: ID!): Room
  }

  type Mutation {
    addRoom(room: RoomInput): Room
    removeRoom(roomID: ID!): Room

    updateRoomName(roomID: ID!, name: String): Room

    addUserToRoom(roomID: ID!, userID: ID!): Room
    removeUserFromRoom(roomID: ID!, userID: ID!): Room

    addLabbieToMonitorRoom(roomID: ID!, labbieID: ID!): Room
    removeLabbieFromMonitorRoom(roomID: ID!, labbieID: ID!): Room
  }
`;
