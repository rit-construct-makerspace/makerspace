import { gql } from "graphql-tag";

export const DataPointsTypeDefs = gql`
    type DataPoint {
        id: ID!,
        label: String!,
        value: Int
    }

    extend type Query {
        dataPoint(id: ID!): DataPoint
    }

    extend type Mutation {
        setDataPointValue(id: ID!, value: Int!): ID
        incrementDataPointValue(id: ID!, increment: Int!): ID
    }
`;