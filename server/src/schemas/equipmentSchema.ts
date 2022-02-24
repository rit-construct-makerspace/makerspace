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

  input EquipmentInput {
    name: String!
    room: String!
    trainingModules: [Int]
    addedAt: DateTime
    inUse: Boolean = false
  }

  type Query {
      equipment: [Equipment]
      trainingModulesByEquipment: [TrainingModule]
  }

  type Mutation {
    addEquipment(Equipment: EquipmentInput): Equipment
    updateEquipment(Equipment: EquipmentInput): Equipment
    removeEquipment(EquipmentId: ID!): Equipment
  }
`;
