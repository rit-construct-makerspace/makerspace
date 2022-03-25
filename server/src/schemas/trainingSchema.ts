import { gql } from "apollo-server-express";

export interface TrainingModule {
  id: number;
  name: string;
}

export enum ModuleItemType {
  MULTIPLE_CHOICE,
  CHECKBOXES,
}

export interface ModuleItem {
  id: number | undefined;
  text: string;
  type: ModuleItemType;
  order: number;
}

export interface Option {
  id: number;
  text: string;
  correct: boolean;
}

export interface ModuleItemAnswerInput {
  moduleItemID: string;
  selectedOptionIDs: string[];
}

export interface ModuleSubmissionInput {
  moduleID: string;
  userID: string;
  answers: ModuleItemAnswerInput[];
}

export interface ModuleItemAnswers {
  moduleItemID: string;
  correctOptionIDs: string[];
}

export const TrainingTypeDefs = gql`
  type TrainingModule {
    id: ID!
    name: String!
    items: [ModuleItem]!
  }

  interface TrainingModuleItem {
    id: ID!
    order: Int
  }

  enum ModuleItemType {
    MULTIPLE_CHOICE
    CHECKBOXES
    TEXT
    YOUTUBE
    IMAGE
  }

  type ModuleItem implements TrainingModuleItem {
    id: ID!
    text: String!
    type: ModuleItemType!
    options: [ModuleItemOption]!
    order: Int
  }

  type ModuleItemOption {
    id: ID!
    text: String!
    correct: Boolean!
  }

  extend type Query {
    modules: [TrainingModule]
    module(id: ID!): TrainingModule
  }

  input ModuleItemInput {
    text: String!
    type: ModuleItemType!
    order: Int
  }

  input ModuleItemOptionInput {
    text: String!
    correct: Boolean!
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

  extend type Mutation {
    createModule(name: String): TrainingModule
    addModuleItem(moduleID: ID!, moduleItem: ModuleItemInput): ModuleItem
    addOption(
      moduleItemID: ID!
      option: ModuleItemOptionInput
    ): ModuleItemOption
    updateModule(id: ID!, name: String): TrainingModule
    updateModuleItem(id: ID!, moduleItem: ModuleItemInput): ModuleItem
    updateOption(id: ID!, option: ModuleItemOptionInput): ModuleItemOption
    deleteModule(id: ID!): TrainingModule
    deleteModuleItem(id: ID!): ModuleItem
    deleteOption(id: ID!): ModuleItemOption
    """
    Submit a trainingModule for assesment, the attempt will be stored for the user and the grade will be returned as a Float out of 100
    """
    submitModule(submission: ModuleSubmissionInput): Float
  }
`;
