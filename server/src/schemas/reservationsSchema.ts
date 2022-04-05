import { gql } from "apollo-server-express";

/*
Potential future enhancements:
  - Attach files to reservations
  - Remove or edit reservation comments
  - Reschedule reservations
 */

export const ReservationsTypeDefs = gql`
  enum ReservationStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  type Reservation {
    id: ID!
    maker: User
    createDate: DateTime
    startTime: DateTime
    endTime: DateTime
    equipment: Equipment
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

  type Query {
    reservations: [Reservation]
    reservation(id: ID!): Reservation
  }

  input ReservationInput {
    makerID: Int!
    equipmentID: Int!
    startTime: DateTime!
    endTime: DateTime!

    """
    If provided, a comment will automatically be placed on the reservation,
    with the maker as the author.
    """
    startingMakerComment: String
  }

  type Mutation {
    createReservation(reservationInput: ReservationInput): Reservation
    addComment(resID: ID!, commentText: String!): Reservation
    cancelReservation(resID: ID!): Reservation
    confirmReservation(resID: ID!): Reservation
  }
`;
