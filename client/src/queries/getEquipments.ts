import { gql } from "@apollo/client";

export const GET_EQUIPMENTS = gql`
  query GetEquipment {
    equipments {
      id
      name
    }
  }
`;

export const GET_RESERVABLE_EQUIPMENT_FOR_MODULE = gql`
  query GetReservableEquipment($moduleID: ID!) {
    module(id: $moduleID) {
      id
      equipment {
        id
        name
      }
    }
  }
`;

export default GET_EQUIPMENTS;
