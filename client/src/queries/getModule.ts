import { gql } from "@apollo/client";

const GET_MODULE = gql`
  query GetModule($id: ID!) {
    module(id: $id) {
      name
      items {
        id
        text
        type
        options {
          id
          text
          correct
        }
      }
    }
  }
`;

export default GET_MODULE;
