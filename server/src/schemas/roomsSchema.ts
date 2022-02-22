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
    roomsByEquipment(equipment: Equipment!): [Room]
    roomsByLabbie(labbie: User!): [Room]
    roomsByIfOpen(isOpen: Boolean!): [Room]
  }

  type Mutation {
    addRoom(room: RoomInput): Room
    removeRoom(room: RoomInput): Room
    
    updateRoomName(roomID: ID!, name: String): Room
    
    addEquipmentToRoom(roomID: ID!, equipment: Equipment): Room
    removeEquipmentFromRoom(roomID: ID!, equipment: Equipment): Room
    
    addUserToRoom(roomID: ID!, user: User): Room
    removeUserFromRoom(roomID: ID!, user: User): Room
    
    addLabbieToRoom(roomID: ID!, labbie: User): Room
    removeLabbieFromRoom(roomID: ID!, labbie: User): Room
    
    closeRoom(roomID: ID!): Room
    openRoom(roomID: ID!): Room
  }
`;
