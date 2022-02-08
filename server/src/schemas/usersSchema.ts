import { gql } from "apollo-server-express";
import { HoldsTypeDefs } from "./holdsSchema";

export const UsersTypeDefs = gql`

  scalar DateTime

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    isStudent: Boolean!
    privilege: Privilege!
    registrationDate: DateTime!
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

    addTrainingModuleToUser(userID: ID!, moduleID: ID!): User
    removeTrainingModuleFromUser(userID: ID!, moduleID: ID!): User

    addHold(userID: ID!, hold: HoldInput): User
    removeHold(userID: ID!, hold: HoldInput): User

    addDescription(userID: ID!, description: String): User

  }
`;
