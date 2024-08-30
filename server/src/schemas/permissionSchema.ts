import { gql } from "graphql-tag";

export const PermissionTypeDefs = gql`
    extend type Query {
        isMentorOrHigher: Boolean
    }
`;