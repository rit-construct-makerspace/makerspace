import { gql } from "apollo-server-express";

export interface ReservationInput {
  makerID: number;
  equipmentID: number;
  startTime: Date;
  endTime: Date;
  startingMakerComment: string;
}

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
    makerID: ID!
    equipmentID: ID!
    startTime: DateTime!
    endTime: DateTime!

    """
    If provided, a comment will automatically be placed
    on the reservation on behalf of the maker.
    """
    startingMakerComment: String
  }

  type Mutation {
    createReservation(reservationInput: ReservationInput): Reservation
    addComment(reservationID: ID!, commentText: String!): Reservation
    cancelReservation(reservationID: ID!): Reservation
    confirmReservation(reservationID: ID!): Reservation
  }
`;
