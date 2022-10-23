import { gql } from "apollo-server-express";

export interface EquipmentInput {
  name: string;
  roomID: number;
  moduleIDs: [number];
}

export const EquipmentTypeDefs = gql`
  type Equipment {
    id: ID!
    name: String!
    room: Room!
    trainingModules: [TrainingModule]
    addedAt: DateTime!
    inUse: Boolean!
    hasAccess(uid: String): Boolean!
  }

  input EquipmentInput {
    name: String!
    roomID: ID!
    moduleIDs: [ID]
  }

  extend type Query {
    equipment(id: ID!): Equipment
    equipments: [Equipment]
  }

  extend type Mutation {
    addEquipment(equipment: EquipmentInput): Equipment
    updateEquipment(id: ID!, equipment: EquipmentInput): Equipment
    deleteEquipment(id: ID!): Equipment
  }
`;
