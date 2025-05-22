/**
 * readersSchema.ts
 * GraphQL declarations for ACS Readers
 */

import { gql } from "graphql-tag";

export const ReaderTypeDefs = gql`
  type Reader {
    id: ID!
    machineID: String
    machineType: String
    name: String
    zone: String
    temp: String
    state: String
    user: User
    recentSessionLength: String
    lastStatusReason: String
    scheduledStatusFreq: String
    lastStatusTime: DateTime
    helpRequested: Boolean
    BEVer: String
    FEVer: String
    HWVer: String
    sessionStartTime: DateTime
    SN: String
  }
  type PairInfo {
    readerKey: String
    name: String
    certs: String
  }

  extend type Query {
    readers: [Reader]
    reader(id: ID!): Reader
  }

  extend type Mutation {
    createReader(
      machineID: ID!
      machineType: String
      name: String
      zone: String
    ): Reader


    pairReader(
      SN: String!
    ): PairInfo


    updateReader(
      id: ID!
      machineID: String
      machineType: String
      zone: String
      temp: String
      state: String
      currentUID: String
      recentSessionLength: String
      lastStatusReason: String
      scheduledStatusFreq: String
      SN: String
    ): Reader

    setName(id: ID!, name: String): Reader
    setState(id: ID!, state: String): String
  }
`;