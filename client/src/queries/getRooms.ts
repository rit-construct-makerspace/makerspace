import { gql } from "@apollo/client";

export const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      name
      recentSwipes {
        id
        user {
          id
          firstName
          lastName
        }
        dateTime
      }
      equipment {
        id
        name
      }
    }
  }
`;

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
    }
  }
`;

export default GET_ROOMS;
