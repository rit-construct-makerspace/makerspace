import { gql } from "@apollo/client";

export const GET_INVENTORY_ITEMS = gql`
  query getInventoryItems {
    InventoryItems {
      id
      name
      unit
      pluralUnit
      count
      pricePerUnit
      threshold
    }
  }
`;

export const GET_INVENTORY_ITEM = gql`
  query GetInventoryItem($id: ID!) {
    InventoryItem(id: $id) {
      name
      unit
      pluralUnit
      pricePerUnit
      count
      threshold
    }
  }
`;

export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($id: ID!, $item: InventoryItemInput) {
    updateInventoryItem(itemId: $id, item: $item) {
      id
    }
  }
`;

export const DELETE_INVENTORY_ITEM = gql`
  mutation DeleteInventorItem($id: ID!) {
    deleteInventoryItem(id: $id)
  }
`;

export const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($item: InventoryItemInput) {
    createInventoryItem(item: $item) {
      id
    }
  }
`;

export const REMOVE_INVENTORY_ITEM_AMOUNT = gql`
  mutation RemoveInventoryItemAmount($itemID: ID!, $amountToRemove: Int!) {
    removeItemAmount(itemId: $itemID, count: $amountToRemove) {
      id
    }
  }
`;