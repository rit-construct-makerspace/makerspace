import { gql } from "graphql-tag";

export interface InventoryItem {
  id: number;
  image: string;
  name: string;
  unit: string;
  pluralUnit: string;
  count: number;
  pricePerUnit: number;
  threshold: number;
}

export interface InventoryItemInput {
  image: string;
  name: string;
  labels: string[];
  unit: string;
  pluralUnit: string;
  count: number;
  pricePerUnit: number;
  threshold: number;
}

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
    deleteInventoryItem(itemId: ID!): InventoryItem
    createInventoryItem(item: InventoryItemInput): InventoryItem
    updateInventoryItem(itemId: ID!, item: InventoryItemInput): InventoryItem
    addItemAmount(itemId: ID!, count: Int!): InventoryItem
    removeItemAmount(itemId: ID!, count: Int!): InventoryItem
    createLabel(label: String): String
    deleteLabel(label: String): String
  }
`;
