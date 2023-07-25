"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingSubmissionTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.TrainingSubmissionTypeDefs = (0, graphql_tag_1.gql) `
  type Submission {
    id: ID!
    moduleID: ID
    makerID: ID
    submissionDate: String
    passed: Boolean
    expirationDate: String!
  }

  extend type Query {
    submission(submissionID: ID): [Submission]
    submissions(moduleID: ID): [Submission]
    latestSubmission(moduleID: ID): Submission
  }
`;
//# sourceMappingURL=trainingSubmissionSchema.js.map