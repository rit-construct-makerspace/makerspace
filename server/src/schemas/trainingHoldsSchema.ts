import { gql } from "graphql-tag";
import { EquipmentRow, TrainingModuleRow } from "../db/tables.js";

export const TrainingHoldsTypeDefs = gql`
  type TrainingHold {
    id: ID!
    userID: ID!
    moduleID: ID!
    expires: DateTime!
    user: User
    module: TrainingModule
  }

  # extend type Query {
  # }

  extend type Mutation {
    deleteTrainingHold(id: ID!): Boolean
  }
`;
