import { gql } from "apollo-server-express";

export const UsersTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    isStudent: Boolean!
    privilege: Privilege!
    registrationDate: Date!
    holds: [Hold]
    trainingModules: [TrainingModule]
    year: Int
    college: String
    major: String
    aboutMe: String
  }

  enum Privilege{
    MAKER
    LABBIE
    ADMIN
  }

  input StudentUserInput {
    firstName: String!
    lastName: String!
    email: String!
    isStudent: Boolean!
    privilege: Privilege!
    year: Int!
    college: String!
    major: String!
  }

  input FacultyUserInput {
    firstName: String!
    lastName: String!
    email: String!
    isStudent: Boolean!
    privilege: Privilege!
  }


  type Query {
    user: User
  }

  type Mutation {
    addStudentUser(user: StudentUserInput): User
    addFacultyUser(user: FacultyUserInput): User

    updateStudentUser(user: StudentUserInput): User
    updateFacultyUser(user: FacultyUserInput): User

    addTraining(userID: ID!, moduleID: ID!): User
    removeTraining(userID: ID!, moduleID: ID!): User

    addHold(userID: ID!, hold: Hold): User
    removeHold(userID: ID!, hold: Hold): User

    addDescription(userID: ID!, description: String): User

  }
`;
