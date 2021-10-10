import { gql } from "apollo-server-express";

export const TrainingTypeDefs = gql`
  type TrainingModule {
    id: ID!
    name: String!
    items: [TrainingModuleItem]!
  }

  type TrainingModuleItem {
    id: ID!
  }

  enum QuestionType {
    MULTIPLE_CHOICE
    CHECKBOXES
  }

  type Question implements TrainingModuleItem {
    text: String!
    questionType: QuestionType!
    options: [QuestionOption]!
  }

  type QuestionOption {
    id: ID!
    text: String!
    correct: Boolean!
  }

  type Query {
    getModules: [TrainingModule]
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
    createModule(name: String)
    createQuestion(question: QuestionInput)
    createQuestionOption(option: QuestionOptionInput)
    updateModule(id: ID!)
    updateQuestion()
    updateQuestionOption()
    deleteModule()
    deleteQuestion()
    deleteQuestionOption()
  }
`;