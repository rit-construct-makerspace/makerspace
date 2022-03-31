import { gql } from "apollo-server-express";

export interface TrainingModule {
  id: number;
  name: string;
  quiz: object;
}

export interface ModuleItemAnswerInput {
  moduleItemID: string;
  selectedOptionIDs: string[];
}

export interface ModuleSubmissionInput {
  moduleID: number;
  userID: number;
  answers: ModuleItemAnswerInput[];
}

export interface ModuleItemAnswer {
  moduleItemID: string;
  correctOptionIDs: string[];
}

export const TrainingTypeDefs = gql`
  scalar JSON

  type TrainingModule {
    id: ID!
    name: String!
    quiz: JSON
  }

  input ModuleItemAnswerInput {
    moduleItemID: ID!
    selectedOptionIDs: [ID]!
  }

  input ModuleSubmissionInput {
    moduleID: ID!
    userID: ID!
    answers: [ModuleItemAnswerInput]
  }

  extend type Query {
    modules: [TrainingModule]
    module(id: ID!): TrainingModule
  }

  extend type Mutation {
    createModule(name: String): TrainingModule
    updateModule(id: ID!, name: String!, quiz: JSON!): TrainingModule
    deleteModule(id: ID!): TrainingModule

    """
    Submit a trainingModule for assessment, the attempt will be stored for the user and the grade will be returned as a Float out of 100
    """
    submitModule(submission: ModuleSubmissionInput): Float
  }
`;
