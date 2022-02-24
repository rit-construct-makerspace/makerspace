import { gql } from "@apollo/client";

const GET_INVENTORY_ITEMS = gql`
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

export default GET_INVENTORY_ITEMS;
