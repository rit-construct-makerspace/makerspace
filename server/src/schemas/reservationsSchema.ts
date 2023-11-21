import { gql } from "graphql-tag";

/*
Potential future enhancements:
  - Attach files to reservations
  - Remove or edit reservation comments
  - Reschedule reservations
 */

export const ReservationsTypeDefs = gql`
  scalar DateTime

  enum ReservationStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  type Reservation {
    id: ID!
    makerID: ID!
    expertID: ID!
    createDate: DateTime
    startTime: DateTime
    endTime: DateTime
    equipmentID: ID!
    status: ReservationStatus
    lastUpdated: DateTime
  }

  enum ReservationEventType {
    COMMENT
    ASSIGNMENT
    CONFIRMATION
    CANCELLATION
  }

  type ReservationEvent {
    id: ID!
    eventType: ReservationEventType
    reservation: Reservation
    user: User
    dateTime: DateTime
    payload: String
  }

  extend type Query {
    reservations: [Reservation]
    reservationIDsByExpert(expertID: ID!): [ID]
    reservationForCard(id: ID!): DisplayReservation
    reservation(id: ID!): Reservation
  }

  input ReservationInput {
    makerID: ID!
    expertID: ID!
    equipmentID: ID!
    startTime: DateTime!
    endTime: DateTime!

    """
    If provided, a comment will automatically be placed on the reservation,
    with the maker as the author.
    """
    startingMakerComment: String
  }
  
  type Maker {
    id: ID!
    name: String!
    image: String
    role: String
  }
  type Equipment {
    id: ID!
    name: String!
    image: String
  }
  type Attachment {
    name: String!
    url: String!
  }
  type DisplayReservation {
      id: ID!
      maker: Maker
      equipment: Equipment
      startTime: String
      endTime: String
      comment: String
      attachments: [Attachment]
      status: ReservationStatus
  }


  extend type Mutation {
    addReservation(reservation: ReservationInput): Reservation
    addComment(resID: ID!, commentText: String!): Reservation
    cancelReservation(resID: ID!): Reservation
    confirmReservation(resID: ID!): Reservation
  }
`;
