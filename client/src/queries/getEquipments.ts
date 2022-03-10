import { gql } from "@apollo/client";

const GET_EQUIPMENTS = gql`
  query GetEquipment {
    equipments {
      id
      name
    }
  }
`;

export default GET_EQUIPMENTS;
