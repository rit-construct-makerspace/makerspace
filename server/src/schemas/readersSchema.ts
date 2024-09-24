import { gql } from "graphql-tag";

export const ReaderTypeDefs = gql`
  type Reader {
    id: ID!,
    machineID: String,
    machineType: String,
    name: String,
    zone: String,
    temp: String,
    state: String,
    user: User
    recentSessionLength: String,
    lastStatusReason: String,
    scheduledStatusFreq: String,
    lastStatusTime: DateTime,
    helpRequested: Boolean
  }

  extend type Query {
    readers: [Reader]
    reader(id: ID!): Reader
  }

  extend type Mutation {
    createReader(
      machineID: ID!,
      machineType: String,
      name: String,
      zone: String
    ): Reader

    updateReader(
      id: ID!,
      machineID: String,
      machineType: String,
      zone: String,
      temp: String,
      state: String,
      currentUID: String,
      recentSessionLength: String,
      lastStatusReason: String,
      scheduledStatusFreq: String,
    ): Reader

    setName(id: ID!, name: String): Reader
  }
`;