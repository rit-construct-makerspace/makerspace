"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreFrontTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.StoreFrontTypeDefs = (0, graphql_tag_1.gql) `
  type InventoryItem {
    id: ID!
    image: String
    name: String
    labels: [String]
    unit: String
    pluralUnit: String
    count: Int
    pricePerUnit: Float
    threshold: Int
  }

  input InventoryItemInput {
    image: String
    name: String
    labels: [String]
    unit: String
    pluralUnit: String
    count: Int
    pricePerUnit: Float
    threshold: Int
  }

  extend type Query {
    InventoryItems: [InventoryItem]
    InventoryItem(Id: ID!): InventoryItem
    Labels: [String]
  }

  extend type Mutation {
    archiveInventoryItem(itemId: ID!): InventoryItem
    createInventoryItem(item: InventoryItemInput): InventoryItem
    updateInventoryItem(itemId: ID!, item: InventoryItemInput): InventoryItem
    addItemAmount(itemId: ID!, count: Int!): InventoryItem
    removeItemAmount(itemId: ID!, count: Int!): InventoryItem
    createLabel(label: String): String
    archiveLabel(label: String): String
  }
`;
//# sourceMappingURL=storeFrontSchema.js.map