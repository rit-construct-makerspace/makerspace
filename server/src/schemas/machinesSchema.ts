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

  type Query {
    equipmentLabels: [EquipmentLabel]
    equipment: [Equipment]
  }

  type Mutation {
    createEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel
    updateEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel
    removeEquipmentLabel(EquipmentLabel: EquipmentLabelInput): EquipmentLabel

    attachTrainingModuleToEquipmentLabel(
      EquipmentLabelId: ID!
      trainingModule: ID!
    ): EquipmentLabel
    detachTrainingModuleFromEquipmentLabel(
      EquipmentLabelId: ID!
      trainingModule: ID!
    ): EquipmentLabel

    addEquipment(Equipment: EquipmentInput): Equipment
    updateEquipment(Equipment: EquipmentInput): Equipment
    removeEquipment(EquipmentId: ID!): Equipment
  }
`;
