import { gql } from "apollo-server-express";

export const StoreFrontTypeDefs = gql`

  scalar DateTime

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
    createDate: DateTime
    expectedDeliveryDate: DateTime
    items: [PurchaseOrderItem]
    attachments: [String]
  }

  input PurchaseOrderItemInput {
    itemId: Int
    count: Int
  }

  input PurchaseOrderInput {
    creatorID: Int
    expectedDeliveryDate: DateTime
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
    InventoryItem(Id: ID!): InventoryItem
    PurchaseOrders: [PurchaseOrder]
    PurchaseOrder(Id: ID!): PurchaseOrder
    Labels: [String]
  }

  type Mutation {
    createPurchaseOrder(PO: PurchaseOrderInput): PurchaseOrder
    deletePurchaseOrder(POId: ID!): PurchaseOrder
    deleteInventoryItem(itemId: ID!): InventoryItem
    addItemToPurchaseOrder(POId: ID!, itemId: ID!, count: Int): PurchaseOrder
    removeItemFromPurchaseOrder(POId: ID!, itemId: ID!): PurchaseOrder
    updateItemAmountInPurchaseOrder(POId: ID!, POItemId: ID!, count: Int!): PurchaseOrder
    addAttachmentsToPurchaseOrder(POId: ID!, attachments: [String]): PurchaseOrder
    removeAttachmentFromPurchaseOrder(POId: ID!, attachment: String): PurchaseOrder
    addItemToInventory(item: InventoryItemInput): InventoryItem
    addItemAmount(itemId: ID!, count: Int!): InventoryItem
    removeItemAmount(itemId: ID!, count: Int!): InventoryItem
    createLabel(label: String): String
    deleteLabel(label: String): String
  }
`;
