import { gql } from "apollo-server-express";

export const UsersTypeDefs = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    type: Type!
    privilege: Privilege!
    registration_date: Date!
    balance: Int!
    hold: Boolean!
    holds: [Hold]
    training_modules: [TrainingModule]
    year: Int
    college: String
    major: String
    description: String
  }

  enum Type{
    STUDENT
    FACULTY
    EMPLOYEE
  }

  enum Privilege{
    MAKER
    LABBIE
    ADMIN
  }

  input StudentUserInput {
    first_name: String!
    last_name: String!
    email: String!
    privilege: Privilege!
    balance: Int!
    hold: Boolean!
    year: Int!
    college: String!
    major: String!
  }

  input FacultyUserInput {
    first_name: String!
    last_name: String!
    email: String!
    type: Type!
    privilege: Privilege!
    balance: Int!
    hold: Boolean!
  }

  type Query {
    user: User
    users: [User]

  }

  type Mutation {
    addStudentUser(user: StudentUserInput): User
    addFacultyUser(user: FacultyUserInput): User
    updateStudentUser(user: StudentUserInput): User
    updateFacultyUser(user: FacultyUserInput): User
    #addTrainingModuleToUser(userID: ID, TrainingModule: module): User
    addHold(userID: ID!, hold: Hold): User
    removeHold(userID: ID!, hold: Hold): User

    addDescription(userID: ID!, description: String): User

  }