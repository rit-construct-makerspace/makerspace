import { gql } from "graphql-tag";

export const AccessCheckTypeDefs = gql`
    type AccessCheck {
        id: ID!,
        userID: ID,
        equipmentID: ID,
        readyDate: DateTime,
        approved: Boolean
    }

    extend type Query {
        accessChecks: [AccessCheck]
        accessCheck(id: ID!): AccessCheck
        unapprovedAccessChecks: [AccessCheck]
        approvedAccessChecks: [AccessCheck]
    }

    extend type Mutation {
        approveAccessCheck(id: ID!): AccessCheck
        unapproveAccessCheck(id: ID!): AccessCheck
        createAccessCheck(userID: ID!, equipmentID: ID!): Boolean
        refreshAccessChecks(userID: ID!): Boolean
    }
`;