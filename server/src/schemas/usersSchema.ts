import { gql } from "apollo-server-express";
import { TrainingModule } from "../models/training/trainingModule";
import { Hold } from "./holdsSchema";

export enum Privilege {
  MAKER,
  LABBIE,
  ADMIN,
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isStudent: boolean;
  privilege: Privilege;
  registrationDate: Date;
  holds: [Hold];
  completedModules: [TrainingModule];
  expectedGraduation: string;
  college: string;
  major: string;
  roomID: number;
}

export interface StudentUserInput {
  firstName: string;
  lastName: string;
  email: string;
  expectedGraduation: string;
  college: string;
  major: string;
}

export const UsersTypeDefs = gql`
  enum Privilege {
    MAKER
    LABBIE
    ADMIN
  }

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
    expectedGraduation: String
    college: String
    major: String
    room: Room
    roomMonitoring: Room
  }

  input StudentUserInput {
    firstName: String!
    lastName: String!
    email: String!
    expectedGraduation: String!
    college: String!
    major: String!
  }

  input FacultyUserInput {
    firstName: String!
    lastName: String!
    email: String!
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
  }

  extend type Mutation {
    createStudentUser(user: StudentUserInput): User
    createFacultyUser(user: FacultyUserInput): User

    updateStudentUser(user: StudentUserInput): User
    updateFacultyUser(user: FacultyUserInput): User

    setPrivilege(userID: ID!, privilege: Privilege): User

    addTraining(userID: ID!, moduleID: ID!): User
    removeTraining(userID: ID!, moduleID: ID!): User

    addHold(userID: ID!, hold: HoldInput): User
    removeHold(userID: ID!, hold: HoldInput): User
  }
`;
