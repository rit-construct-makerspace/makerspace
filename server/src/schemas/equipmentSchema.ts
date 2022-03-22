import { gql } from "apollo-server-express";

export const EquipmentTypeDefs = gql`
  type Equipment {
    id: ID!
    name: String!
    room: Room!
    trainingModules: [TrainingModule]
    addedAt: DateTime!
    inUse: Boolean!
  }

  input EquipmentInput {
    name: String!
    roomID: ID!
    trainingModules: [ID]
    addedAt: DateTime
    inUse: Boolean = false
  }

  extend type Query {
    equipment(id: ID!): Equipment
    equipments: [Equipment]
    trainingModulesByEquipment: [TrainingModule]
  }

  extend type Mutation {
    addEquipment(equipment: EquipmentInput): Equipment
    updateEquipment(id: ID!, equipment: EquipmentInput): Equipment
    archiveEquipment(id: ID!): Equipment
  }
`;
