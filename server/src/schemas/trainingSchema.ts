import { gql } from "apollo-server-express";

export interface TrainingModule {
  id: number;
  name: string;
}

export enum ModuleItemType {
  MULTIPLE_CHOICE,
  CHECKBOXES
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

  extend type Mutation {
    createModule(name: String): TrainingModule
    addModuleItem(moduleID: ID!, moduleItem: ModuleItemInput): ModuleItem
    addOption(moduleItemID: ID!, option: ModuleItemOptionInput): ModuleItemOption
    updateModule(id: ID!, name: String): TrainingModule
    updateModuleItem(id: ID!, moduleItem: ModuleItemInput): ModuleItem
    updateOption(id: ID!, option: ModuleItemOptionInput): ModuleItemOption
    deleteModule(id: ID!): TrainingModule
    deleteModuleItem(id: ID!): ModuleItem
    deleteOption(id: ID!): ModuleItemOption
  }
`;
