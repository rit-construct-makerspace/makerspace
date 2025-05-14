import { gql } from "@apollo/client";

export const GET_ACCESS_CHECKS_BY_USERID = gql`
  query getAccessChecksByUserID($userID: ID!) {
    accessChecksByUserID(userID: $userID) {
      id
      userID
      readyDate
      approved
      equipment {
            id
            name
            addedAt
            inUse
            room {
                id
                name
            }
            archived
            imageUrl
            sopUrl
            notes
            byReservationOnly
            trainingModules {
                id
                name
                archived
                quiz
                isLocked
            }
        }
    }
  }
`;