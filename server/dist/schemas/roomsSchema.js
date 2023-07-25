"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.RoomTypeDefs = (0, graphql_tag_1.gql) `
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

    swipeIntoRoom(roomID: ID!, universityID: String!): User
  }
`;
//# sourceMappingURL=roomsSchema.js.map