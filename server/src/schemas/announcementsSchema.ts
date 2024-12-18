/**
 * announcementsSchema.ts
 * GraphQL declarations for Announcements
 */

import { gql } from "graphql-tag";

export const AnnouncementsTypeDefs = gql`
  type Announcement {
    id: ID!
    title: String!
    description: String!
  }

  input AnnouncementInput {
    title: String!
    description: String!
  }

  type Query {
    getAnnouncement(id: ID!): Announcement
    getAllAnnouncements: [Announcement]
  }

  type Mutation {
    createAnnouncement(title: String!, description: String!): Announcement
    updateAnnouncement(id: ID!, title: String!, description: String!): Announcement
    updateAnnouncementWithInputType(id: ID!, input: AnnouncementInput!): Announcement
    deleteAnnouncement(id: ID!): Boolean
  }
`;
