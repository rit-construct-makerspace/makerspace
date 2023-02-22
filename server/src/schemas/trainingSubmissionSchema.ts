import { gql } from "graphql-tag";

export interface Submission {
    id: string;
    moduleID: string;
    makerID: string;
    submissionDate: string;
    passed: boolean;
    expirationDate: string;
}

export const TrainingSubmissionTypeDefs = gql`
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
