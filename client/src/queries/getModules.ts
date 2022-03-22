import { gql } from "@apollo/client";

const GET_TRAINING_MODULES = gql`
  query GetTrainingModules {
    modules {
      id
      name
    }
  }
`;

export default GET_TRAINING_MODULES;
