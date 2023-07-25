"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.AnnouncementsTypeDefs = (0, graphql_tag_1.gql) `
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
//# sourceMappingURL=announcementsSchema.js.map