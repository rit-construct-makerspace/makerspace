import { gql } from "graphql-tag";
import { UserRow } from "../db/tables";

export enum Privilege {
  MAKER = "MAKER",    // Maker
  MENTOR = "MENTOR",  // Mentor
  STAFF = "STAFF",    // Staff
}


export interface PassedModule {
  id: number;
  moduleID: number;
  moduleName: string;
  submissionDate: Date;
  expirationDate: Date;
}

export interface UserResolver extends UserRow {
  passedModules?: PassedModule[];
}

export const UsersTypeDefs = gql`
  enum Privilege {
    MAKER
    MENTOR
    STAFF
  }

  type PassedModule {
    id: ID!
    moduleID: ID!
    moduleName: String!
    submissionDate: DateTime!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    pronouns: String
    email: String!
    isStudent: Boolean!
    privilege: Privilege!
    registrationDate: DateTime!
    holds: [Hold]
    passedModules: [PassedModule]
    expectedGraduation: String
    college: String
    room: Room
    roomMonitoring: Room

    """
    The number-letter combination that is attached to your RIT email
    (ie. abc1234). Not sensitive info. Stored plainly.
    Not to be confused with the universityID.
    """
    ritUsername: String!

    """
    The nine digit number encoded in the mag strip of RIT ID cards.
    Can also be found on the eServices and/or myRIT portals.
    Sensitive information. Stored as a SHA256 hash in the database.
    Not to be confused with RIT usernames (ie. abc1234)
    """
    universityID: String

    """
    Has the user completed the signup form?
    """
    setupComplete: Boolean

    """
    Is the user's account suspended/deleted?
    """
    isArchived: Boolean
  }

  input StudentUserInput {
    universityID: String!
    ritUsername: String!
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
    currentUser: User
  }

  extend type Mutation {
    createUser(
      firstName: String
      lastName: String
      ritUsername: String
      email: String
    ): User

    updateStudentProfile(
      userID: ID!
      pronouns: String
      college: String
      expectedGraduation: String
      universityID: String
    ): User

    setPrivilege(userID: ID!, privilege: Privilege): User

    deleteUser(userID: ID!): User
  }
`;
