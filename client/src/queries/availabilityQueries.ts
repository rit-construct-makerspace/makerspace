import gql from "graphql-tag";

export const GET_AVAILABILITY_BY_DATE_AND_USER = gql`
    query GetAvailability($date: String!, $userID: ID!) {
        availabilityByDateAndUser(date: $date, userID: $userID) {
            id
            date
            startTime
            endTime
            userID
        }
   }
`;

export const GET_AVAILABILITY_BY_DATE = gql`
    query GetAvailability($date: String!) {
        availabilityByDate(date: $date) {
            id
            date
            startTime
            endTime
            userID
        }
   }
`;

export const CREATE_AVAILABILITY_SLOT = gql`
  mutation CreateAvailabilitySlot($date: String!, $startTime: String!, $endTime: String!, $userID: ID!) {
    createAvailabilitySlot(input: { date: $date, startTime: $startTime, endTime: $endTime, userID: $userID }) {
      date
      startTime
      endTime
      userID
    }
  }
`;

export const UPDATE_AVAILABILITY_SLOT = gql`
  mutation UpdateAvailabilitySlot($id: ID!, $date: String!, $startTime: String!, $endTime: String!, $userID: ID!) {
    updateAvailabilitySlot(
    id: $id, 
    input: { date: $date, startTime: $startTime, endTime: $endTime, userID: $userID }
    ) {
      id
      date
      startTime
      endTime
      userID
    }
  }
`;

export const DELETE_AVAILABILITY_SLOT = gql`
  mutation DeleteAvailabilitySlot($id: ID!) {
    deleteAvailabilitySlot( id: $id )
  }
`;