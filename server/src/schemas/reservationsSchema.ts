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
    creator: User
    maker: User
    labbie: User
    createDate: DateTime
    startTime: DateTime
    endTime: DateTime
    equipment: Equipment
    status: ReservationStatus
    lastUpdated: DateTime
    """
    **True:** The maker is proficient with the machine,
    has not requested a labbie, and does not need labbie supervision.

    **False:** The maker is *not* proficient with the machine,
    *does* need labbie supervision. The reservation cannot
    be approved until a labbie is assigned.
    """
    independent: Boolean
  }

  enum ReservationEventType {
    COMMENT
    ASSIGNMENT
    CONFIRMATION
    CANCELLATION
  }

  type ReservationEvent {
    id: ID!
    reservationId: ID!
    eventType: ReservationEventType
    user: User
    dateTime: DateTime
    payload: String
  }

  type Query {
    reservations: [Reservation]
    reservation(id: ID!): Reservation
    reservationsByUser(id: ID!): [Reservation]
  }

  input ReservationInput {
    creatorId: Int!
    makerId: Int!
    equipmentId: Int!

    """
    Leave blank to create an unassigned reservation.
    """
    labbieId: Int

    """
    If provided, a comment will automatically be placed on the reservation,
    with the maker as the author.
    """
    startingMakerComment: String
  }

  type Mutation {
    createReservation(reservationInput: ReservationInput): Reservation
    assignLabbieToReservation(resId: ID!, labbieId: ID!): Reservation
    removeLabbieFromReservation(resId: ID!): Reservation
    addComment(resId: ID!, authorId: ID!, commentText: String!): Reservation
    cancelReservation(resId: ID!): Reservation
    confirmReservation(resId: ID!): Reservation
  }
`;
