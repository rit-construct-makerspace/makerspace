import { gql } from "apollo-server-express";

export const StoreFrontTypeDefs = gql`

  scalar Date

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

  type PurchaseOrderItem {
    id: ID!
    item: InventoryItem
    count: Int
  }

  type PurchaseOrder {
    id: ID!
    creator: Person
    createDate: Date
    expectedDeliveryDate: Date
    items: [PurchaseOrderItem]
    attachments: [String]
  }

  input PurchaseOrderItemInput {
    itemID: Int
    count: Int
  }

  input PurchaseOrderInput {
    creatorID: Int
    expectedDeliveryDate: Date
    items: [PurchaseOrderItemInput]
    attachments: [String]
  }

  # might belong in a different file but just gonna throw it here for now
  type Person {
    id: ID!
    name: String
    image: String
  }

  type Query {
    InventoryItems: [InventoryItem]
    PurchaseOrders: [PurchaseOrder]
  }

  type Mutation {
    createPurchaseOrder(PO: PurchaseOrderInput): PurchaseOrder
    addItemToPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
    removeItemFromPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
    updateItemAmountInPurchaseOrder(POId: ID!, POItemId: ID!, count: Int!): PurchaseOrder
    addAttachmentsToPurchaseOrder(POId: ID!, attachments: [String]): PurchaseOrder
    removeAttachmentFromPurchaseOrder(POId: ID!, attachment: String): PurchaseOrder
    addItemToInventory(item: InventoryItemInput): InventoryItem
    addItemAmount(itemId: ID!, count: Int!): InventoryItem
    removeItemAmount(itemId: ID!, count: Int!): InventoryItem
  }
`;
