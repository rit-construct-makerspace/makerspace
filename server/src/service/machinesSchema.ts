import { gql } from "apollo-server-express";

export const MachinesTypeDefs = gql`
  type Machine {
    id: ID!
    machineFamily: MachineFamily!
    name: String!
    room: String!
    addedAt: Date
    inUse: Boolean!
  }

  type MachineFamily {
    id: ID!
    name: String!
    description: String
    trainingModule: TrainingModule!
  }

  type Reservation {
    id: ID!
    userId: User!
    supervisorId: User!
    machineId: Machine!
    createdAt: Date
    startTime: DateTime!
    endTime: DateTime!
  }

  input MachineInput {
    machineFamily: MachineFamily!
    name: String!
    room: String!
    addedAt: Date
    inUse: Boolean!
  }

  input MachineFamilyInput {
    name: String!
    description: String
    trainingModule: TrainingModule!
  }

  input ReservationInput {    
    userId: User!
    supervisorId: User!
    machineId: Machine!
    createdAt: Date
    startTime: DateTime!
    endTime: DateTime!
  }

  type Query {
      machineFamilies: [MachineFamily]
      machines: [Machine]
      reservations: [Reservations]
  }

  type Mutation {
    createMachineFamily(machineFamily: MachineFamilyInput): MachineFamily

    attachTrainingModuleToMachineFamily(machineFamilyId: ID!, trainingModule: ID!): MachineFamily
    updateTrainingModuleInMachineFamily(machineFamilyId: ID!, trainingModule: ID!): MachineFamily
    detachTrainingModuleFromMachineFamily(machineFamilyId: ID!): MachineFamily

    updateMachineFamily(machineFamily: MachineFamilyInput): MachineFamily
    removeMachineFamily(machineFamily: MachineFamilyInput): MachineFamily

    addMachine(machine: MachineInput): Machine
    updateMachine(machine: MachineInput): Machine
    removeMachine(machineId: ID!): Machine
    
    createReservation(reservation: ReservationInput): Reservation
    updateReservation(reservation: ReservationInput): Reservation
    removeReservation(reservationId: ID!): Reservation
  }
`;