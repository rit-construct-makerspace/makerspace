import { gql } from "apollo-server-express";

export interface Swipe {
  id: string;
  dateTime: Date;
  roomID: string;
  userID: string;
}

export const RoomTypeDefs = gql`
  type Swipe {
    id: ID!
    dateTime: DateTime
    user: User
  }

  type Room {
    id: ID!
    name: String!
    equipment: [Equipment]
    recentSwipes: [Swipe]
    labbies: [User]
  }

  input RoomInput {
    name: String!
  }

  extend type Query {
    rooms: [Room]
    room(id: ID!): Room
  }

  extend type Mutation {
    addRoom(room: RoomInput): Room
    removeRoom(roomID: ID!): Room

    updateRoomName(roomID: ID!, name: String): Room

    swipeIntoRoom(roomID: ID!, universityID: String!): User
  }
`;
