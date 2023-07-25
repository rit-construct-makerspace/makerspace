"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.EquipmentTypeDefs = (0, graphql_tag_1.gql) `
  type Equipment {
    id: ID!
    name: String!
    archived: Boolean!
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
//# sourceMappingURL=equipmentSchema.js.map