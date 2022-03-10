import { gql } from "apollo-server-express";

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
    room: Room
    roomMonitoring: Room
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
    createStudentUser(user: StudentUserInput): User
    createFacultyUser(user: FacultyUserInput): User

    updateStudentUser(user: StudentUserInput): User
    updateFacultyUser(user: FacultyUserInput): User

    addTraining(userID: ID!, moduleID: ID!): User
    removeTraining(userID: ID!, moduleID: ID!): User

    addHold(userID: ID!, hold: HoldInput): User
    removeHold(userID: ID!, hold: HoldInput): User

    updateAboutMe(userID: ID!, aboutMe: String): User
  }
`;
