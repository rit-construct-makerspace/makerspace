/**
 * roomsSchema.ts
 * GraphQL declarations for Rooms
 */

import { gql } from "graphql-tag";

export interface Swipe {
  id: number;
  dateTime: Date;
  roomID: number;
  userID: number;
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
    zone: Zone
    equipment: [Equipment]
    recentSwipes: [Swipe]
    mentors: [User]
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
    setZone(roomID: ID!, zoneID: ID!): Room

    swipeIntoRoom(roomID: ID!, universityID: String!): User
  }
`;
