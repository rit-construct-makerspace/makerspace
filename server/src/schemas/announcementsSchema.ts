import { gql } from "graphql-tag";

export const AnnouncementsTypeDefs = gql`
  type Announcement {
    id: ID!
    title: String!
    description: String!
    postDate: String!
    expDate: String
  }

  input AnnouncementInput {
    title: String!
    desrciption: String
  }

  extend type Query {
    announcements: [Announcement]
  }

  extend type Mutation {
    createAnnouncement(title: String!, description: String!): Announcement
  }
`;
