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
        acessCheck(id: ID!): AccessCheck
        unapprovedAccessChecks: [AccessCheck]
        approvedAccessChecks: [AccessCheck]
    }

    extend type Mutation {
        setApproved(id: ID!, approved: boolean): AccessCheck
    }
`;