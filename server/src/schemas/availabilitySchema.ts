import gql from "graphql-tag";

export interface AvailabilitySlot {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    userID: number;
}

export interface AvailabilityInput {
    date: string;
    startTime: string;
    endTime: string;
    userID: number;
}

export const AvailabilityTypeDefs = gql`
    scalar DateTime
    type AvailabilitySlot {
        id: ID!
        date: String!
        startTime: String!
        endTime: String!
        userID: ID!
    }
    
    input AvailabilityInput {
        date: String!
        startTime: String!
        endTime: String!
        userID: ID!
    }
    
    extend type Query {
        availabilitySlots( date: String!, userID: ID! ): [AvailabilitySlot]
    }
    
    type Mutation {
        createAvailabilitySlot(input: AvailabilityInput!): AvailabilitySlot!
        updateAvailabilitySlot(id: ID!, input: AvailabilityInput!): AvailabilitySlot!
        deleteAvailabilitySlot(id: ID!): Boolean!
    }
`;