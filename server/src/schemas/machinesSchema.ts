import { gql } from "apollo-server-express";

export const EquipmentTypeDefs = gql`

  scalar DateTime

  type Equipment {
    id: ID!
    name: String!
    room: String!
    trainingModules: [TrainingModule]
    addedAt: DateTime!
    inUse: Boolean!
  }

  type Reservation {
    id: ID!
    userId: User!
    supervisorId: User!
    equipmentId: Equipment!
    createdAt: DateTime!
    startTime: DateTime!
    endTime: DateTime!
  }

  input EquipmentInput {
    name: String!
    room: String!
    trainingModules: [Int]
    addedAt: DateTime
    inUse: Boolean = false
  }

  input ReservationInput {    
    userId: Int!
    supervisorId: Int!
    equipmentId: Int!
    createdAt: DateTime
    startTime: DateTime!
    endTime: DateTime!
  }

  type Query {
      equipment: [Equipment]
      trainingModulesByEquipment: [TrainingModule]
      reservations: [Reservation]
  }

  type Mutation {
    addEquipment(Equipment: EquipmentInput): Equipment
    updateEquipment(Equipment: EquipmentInput): Equipment
    removeEquipment(EquipmentId: ID!): Equipment
    
    createReservation(reservation: ReservationInput): Reservation
    updateReservation(reservation: ReservationInput): Reservation
    removeReservation(reservationId: ID!): Reservation
  }
`;
