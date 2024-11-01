import { gql } from "graphql-tag";

export interface ToolItemTypeInput {
  name: string;
  defaultLocationRoomID: number;
  defaultLocationDescription: string;
  description: string;
  checkoutNote: string;
  checkinNote: string;
  allowCheckout: boolean;
}

export interface ToolItemInstanceInput {
  typeID: number;
  uniqueIdentifier: string;
  locationRoomID: number;
  locationDescription: string;
  condition: string;
  status: string;
  notes: string;
}

export const TermsTypeDefs = gql`
  type ToolItemType {
    id: ID!
    name: String!
    defaultLocationRoomID: ID
    defaultLocationDescription: String
    description: String
    checkoutNote: String
    checkinNote: String
    allowCheckout: Boolean!
    instances: [ToolItemInstance]
  }

  type ToolItemInstance {
    id: ID!
    type: ToolItemType!
    uniqueIdentifier: String!
    locationRoomID: Int
    locationDescription: String
    condition: String!
    status: String!
    notes: String
    borrower: User
  }

  input ToolItemTypeInput {
    name: String!
    defaultLocationRoomID: ID
    defaultLocationDescription: String
    description: String
    checkoutNote: String
    checkinNote: String
    allowCheckout: Boolean!
  }

  input ToolItemInstanceInput {
    typeID: ID!
    uniqueIdentifier: String!
    locationRoomID: Int
    locationDescription: String
    condition: String!
    status: String!
    notes: String
  }

  extend type Query {
    toolItemTypes: [ToolItemType]
    toolItemTypesAllowCheckout: [ToolItemType]
    toolItemType(id: ID!): ToolItemType
    toolItemInstances: [ToolItemInstance]
    toolItemInstance(id: ID!) ToolItemInstance
  }

  extend type Mutation {
    createToolItemType(toolItemType: ToolItemTypeInput): ToolItemType
    updateToolItemType(id: ID!, toolItemType: ToolItemTypeInput): ToolItemType
    createToolItemInstance(toolItemInstance: ToolItemInstanceInput): ToolItemInstance
    updateToolItemInstance(id: ID!, toolItemInstance: ToolItemInstanceInput): ToolItemInstance
    borrowInstance(userID: ID!, instanceID: ID!): Boolean
    returnInstance(instanceID: ID!): Boolean
  }
`;