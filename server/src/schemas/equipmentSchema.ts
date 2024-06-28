import { gql } from "graphql-tag";

export interface EquipmentInput {
  name: string;
  roomID: number;
  moduleIDs: number[];
  pictureURL?: string;
}

export const EquipmentTypeDefs = gql`
  type Equipment {
    id: ID!
    name: String!
    archived: Boolean!
    room: Room!
    trainingModules: [TrainingModule]
    addedAt: DateTime!
    inUse: Boolean!
    hasAccess(uid: String): Boolean!
    pictureURL: String
  }

  input EquipmentInput {
    name: String!
    roomID: ID!
    moduleIDs: [ID]
    pictureURL: String
  }

  extend type Query {
    equipments: [Equipment]
    equipment(id: ID!): Equipment
    archivedEquipments: [Equipment]
    archivedEquipment(id: ID!): Equipment
  }

  extend type Mutation {
    addEquipment(equipment: EquipmentInput): Equipment
    updateEquipment(id: ID!, equipment: EquipmentInput): Equipment
    archiveEquipment(id: ID!): Equipment
    publishEquipment(id: ID!): Equipment
  }
`;
