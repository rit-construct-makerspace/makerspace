import gql from "graphql-tag";

export interface AvailabilitySlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

export const AvailabilityTypeDefs = gql`
    scalar DateTime
    type AvailabilitySlot {
        id: ID!
        date: String!
        startTime: DateTime!
        endTime: DateTime!
        userID: String!
    }
    
    extend type Query {
        availabilitySlots( date: String!, userID: ID! ): [AvailabilitySlot]
    }
    
    type Mutation {
        createAvailabilitySlot(date: String!, startTime: DateTime!, endTime: DateTime!, userID: ID!): AvailabilitySlot
    }
`;