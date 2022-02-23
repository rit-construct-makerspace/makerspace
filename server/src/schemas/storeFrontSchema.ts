import { gql } from "apollo-server-express";

export const StoreFrontTypeDefs = gql`
  type InventoryItem {
    id: ID!
    image: String
    name: String
    labels: [String]
    unit: String
    pluralUnit: String
    count: Int
    pricePerUnit: Float
  }

  input InventoryItemInput {
    image: String
    name: String
    labels: [String]
    unit: String
    pluralUnit: String
    count: Int
    pricePerUnit: Float
  }

  extend type Query {
    InventoryItems: [InventoryItem]
    InventoryItem(Id: ID!): InventoryItem
    Labels: [String]
  }

  extend type Mutation {
    deleteInventoryItem(itemId: ID!): InventoryItem
    createInventoryItem(item: InventoryItemInput): InventoryItem
    updateInventoryItem(itemId: ID!, item: InventoryItemInput): InventoryItem
    addItemAmount(itemId: ID!, count: Int!): InventoryItem
    removeItemAmount(itemId: ID!, count: Int!): InventoryItem
    createLabel(label: String): String
    deleteLabel(label: String): String
  }
`;
