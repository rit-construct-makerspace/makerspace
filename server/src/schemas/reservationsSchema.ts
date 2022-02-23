import { gql } from "apollo-server-express";

/*
Potential future enhancements:
  - Attach files to reservations
  - Remove or edit reservation comments
  - Reschedule reservations
 */

export const ReservationsSchema = gql`
  enum ReservationStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  type Reservation {
    id: ID!
    maker: User
    labbie: User
    createDate: DateTime
    creator: Person
    equipment: Equipment
    status: ReservationStatus
    lastUpdated: DateTime
    events: [ReservationEvent]
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
    creatorId: ID!
    makerId: ID!
    equipmentId: ID!
    labbieId: ID # leave undefined for an unassigned reservation
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
