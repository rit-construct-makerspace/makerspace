import gql from "graphql-tag";

export const GET_ALL_AVAILABILITY = gql`
    query GetAvailability($date: String!, $userID: ID!) {
        availabilitySlots(date: $date, userID: $userID) {
            id
            date
            startTime
            endTime
            userID
        }
   }
`;

export const CREATE_AVAILABILITY_SLOT = gql`
  mutation CreateAvailabilitySlot($date: String!, $startTime: DateTime!, $endTime: DateTime!, $userID: ID!) {
    createAvailabilitySlot(date: $date, startTime: $startTime, endTime: $endTime, userID: $userID){
        id
    }
  }
`;