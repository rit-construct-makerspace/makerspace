import { gql } from "@apollo/client";

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      pictureURL
    }
  }
`;

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
      }
      equipment {
        id
        name
      }
    }
  }
`;

export const SWIPE_INTO_ROOM = gql`
  mutation SwipeIntoRoom($roomID: ID!, $universityID: String!) {
    swipeIntoRoom(roomID: $roomID, universityID: $universityID) {
      id
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    addRoom(room: $input) {
      id
      name
      pictureURL
    }
  }
`;

export default GET_ROOMS;
