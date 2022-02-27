import { gql } from "apollo-server-express";

export const EquipmentTypeDefs = gql`

  scalar DateTime

  type Equipment {
    id: ID!
    name: String!
    room: Room!
    equipmentLabels: [EquipmentLabel]
    addedAt: DateTime!
    inUse: Boolean!
  }

  type EquipmentLabel {
    id: ID!
    name: String!
    trainingModules: [TrainingModule]
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
    roomID: ID!
    equipmentLabels: [Int]
    addedAt: DateTime
    inUse: Boolean = false
  }

  input EquipmentLabelInput {
    name: String!
    trainingModules: [Int]
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
      equipmentLabels: [EquipmentLabel]
      equipment: [Equipment]
      reservations: [Reservation]
  }

  type Mutation {
    createEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel
    updateEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel
    removeEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel

    attachTrainingModuleToEquipmentLabel(EquipmentLabelId: ID!, trainingModule: ID!): EquipmentLabel
    detachTrainingModuleFromEquipmentLabel(EquipmentLabelId: ID!, trainingModule: ID!): EquipmentLabel

    addEquipment(Equipment: EquipmentInput): Equipment
    updateEquipment(Equipment: EquipmentInput): Equipment
    removeEquipment(EquipmentId: ID!): Equipment
    
    createReservation(reservation: ReservationInput): Reservation
    updateReservation(reservation: ReservationInput): Reservation
    removeReservation(reservationId: ID!): Reservation
  }
`;
