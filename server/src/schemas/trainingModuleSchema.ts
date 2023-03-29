import { gql } from "graphql-tag";

export interface TrainingModule {
  id: number;
  name: string;
  quiz: object;
}

export interface AnswerInput {
  itemID: string;
  optionIDs: string[];
}

export const TrainingModuleTypeDefs = gql`
  scalar JSON

  type TrainingModule {
    id: ID!
    name: String!
    quiz: JSON
    reservationPrompt: JSON
    equipment: [Equipment]
  }

  input AnswerInput {
    itemID: ID!
    optionIDs: [ID]!
  }

  extend type Query {
    modules: [TrainingModule]
    module(id: ID!): TrainingModule
    archivedModules: [TrainingModule]
    archivedModule(id: ID!): TrainingModule
  }

  extend type Mutation {
    createModule(name: String): TrainingModule
    updateModule(id: ID!, name: String!, quiz: JSON!, reservationPrompt: JSON): TrainingModule
    archiveModule(id: ID!): TrainingModule

    """
    Submit a trainingModule for assessment, the attempt will be stored
    for the user and the grade will be returned as a Float out of 100
    """
    submitModule(moduleID: ID!, answerSheet: [AnswerInput]): ID
  }
`;
