import { gql } from "graphql-tag";

export const StaffScheduleTypeDefs = gql`
  type StaffShift {
    id: Int!
    makerspaceID: Int!
    userID: Int!
    start: String!
    end: String!
    user: User!
  }

  input StaffShiftTimeInput {
    userID: Int!
    start: String!
    end: String!
  }

  extend type Query {
    makerspaceStaff(makerspaceID: Int!): [User!]!
    staffShifts(makerspaceID: Int!, start: String!, end: String!): [StaffShift!]!
  }

  extend type Mutation {
    createStaffShifts(makerspaceID: Int!, shifts: [StaffShiftTimeInput!]!): [StaffShift!]!
    updateStaffShift(id: Int!, start: String!, end: String!): StaffShift!
    deleteStaffShift(id: Int!): Int!
  }
`;
