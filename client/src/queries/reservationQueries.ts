import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
    mutation CreateReservation($makerID: ID!, $expertID: ID!, $equipmentID: ID!, $startTime: DateTime!, $endTime: DateTime!, $startingMakerComment: String!) {
        addReservation(
            reservation: {
                makerID: $makerID, 
                expertID: $expertID, 
                equipmentID: $equipmentID, 
                startTime: $startTime, 
                endTime: $endTime,
                startingMakerComment: $startingMakerComment
            }
        )
        {
            id
        }
    }
`;

export const GET_EXPERT_RESERVATION_FOR_CARD = gql`
    query GetDetailedReservationsPerExpert($id: ID!) {
      reservationForCard(id: $id) {
        id
        maker {
          id
          name
          image
          role
        }
        equipment {
          id
          name
          pictureURL
        }
        startTime
        endTime
        comment
        attachments {
          name
          url
        }
        status
      }
    }
`;

export const GET_RESERVATION_IDS_PER_EXPERT = gql`
    query GetIDS($expertID: ID!) {
        reservationIDsByExpert(expertID: $expertID)
    }
`

export const SET_RESERVATION_CANCELLED = gql`
    mutation CancelReservation($resID: ID!) {
        cancelReservation(resID: $resID){id}
    }
`

export const SET_RESERVATION_CONFIRMED = gql`
    mutation ConfirmReservation($resID: ID!) {
        confirmReservation(resID: $resID) {id}
    }
`