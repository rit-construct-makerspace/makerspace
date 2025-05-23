import { gql } from "@apollo/client";

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!) {
    addRoom(room: { name: $name }) {
      id
    }
  }
`;

export default GET_ROOMS;
