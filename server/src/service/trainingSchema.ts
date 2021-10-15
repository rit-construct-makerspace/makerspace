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

  type Query {
    modules: [TrainingModule]
  }

  input QuestionInput {
    text: String!
    questionType: QuestionType!
  }

  input QuestionOptionInput {    
    text: String!
    correct: Boolean!
  }

  type Mutation {
    createModule(name: String): TrainingModule 
    addQuestion(module_id: ID!, question: QuestionInput): Question
    addOption(option: QuestionOptionInput): QuestionOption
    updateModule(id: ID!, name: String): TrainingModule
    updateQuestion(id: ID!, question: QuestionInput): Question
    updateOption(id: ID!, option: QuestionOptionInput): QuestionOption
    deleteModule(id: ID!): TrainingModule
    deleteQuestion(id: ID!): Question
    deleteOption(id: ID!): QuestionOption
  }
`;