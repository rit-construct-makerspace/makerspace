import { gql } from "apollo-server-express";

export const TrainingTypeDefs = gql`
  type TrainingModule {
    id: ID!
    name: String!
    items: [Question]!
  }

  interface TrainingModuleItem {
    id: ID!
  }

  enum QuestionType {
    MULTIPLE_CHOICE
    CHECKBOXES
    TEXT
    YOUTUBE
    IMAGE
  }

  type Question implements TrainingModuleItem {
    id: ID!
    text: String!
    type: QuestionType!
    options: [QuestionOption]!
  }

  type QuestionOption {
    id: ID!
    text: String!
    correct: Boolean!
  }

  extend type Query {
    modules: [TrainingModule]
    module(id: ID!): TrainingModule
  }

  input QuestionInput {
    text: String!
    type: QuestionType!
  }

  input QuestionOptionInput {
    text: String!
    correct: Boolean!
  }

  extend type Mutation {
    createModule(name: String): TrainingModule
    addQuestion(module_id: ID!, question: QuestionInput): Question
    addOption(question_id: ID!, option: QuestionOptionInput): QuestionOption
    updateModule(id: ID!, name: String): TrainingModule
    updateQuestion(id: ID!, question: QuestionInput): Question
    updateOption(id: ID!, option: QuestionOptionInput): QuestionOption
    deleteModule(id: ID!): TrainingModule
    deleteQuestion(id: ID!): Question
    deleteOption(id: ID!): QuestionOption
  }
`;
