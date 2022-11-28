import { gql } from "@apollo/client";

export const SWIPE_INTO_ROOM = gql`
  mutation SwipeIntoRoom($roomID: ID!, $universityID: String!) {
    swipeIntoRoom(roomID: $roomID, universityID: $universityID) {
      id
    }
  }
`;