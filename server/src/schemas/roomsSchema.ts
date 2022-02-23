import { gql } from "apollo-server-express";

export const RoomTypeDefs = gql`

  type Room {
    id: ID!
    name: String!
    equipmentList: [Equipment]
    currentUsers: [User]
    labbies: [User]
    isOpen: Boolean!
  }

  input RoomInput {
    name: String!
    equipmentList: [Equipment]
    currentUsers: [User]
    labbies: [User]
    isOpen: Boolean!
  }
  
  type Query {
    rooms: [Room]
    room(roomID: ID!): Room
    roomByEquipment(equipmentID: ID!): Room
    roomsByLabbie(labbieID: ID!): [Room]
    roomsByIfOpen(isOpen: Boolean!): [Room]
  }

  type Mutation {
    addRoom(room: RoomInput): Room
    removeRoom(roomID: ID!): Room
    
    updateRoomName(roomID: ID!, name: String): Room
    
    addEquipmentToRoom(roomID: ID!, equipmentID: ID!): Room
    removeEquipmentFromRoom(roomID: ID!, equipmentID: ID!): Room
    
    addUserToRoom(roomID: ID!, userID: ID!): Room
    removeUserFromRoom(roomID: ID!, userID: ID!): Room
    
    addLabbieToRoom(roomID: ID!, labbieID: ID!): Room
    removeLabbieFromRoom(roomID: ID!, labbieID: ID!): Room
    
    closeRoom(roomID: ID!): Room
    openRoom(roomID: ID!): Room
  }
`;
