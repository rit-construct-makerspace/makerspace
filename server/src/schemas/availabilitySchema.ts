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
        availabilityByDateAndUser( date: String!, userID: ID! ): [AvailabilitySlot]
        availabilityByDate( date: String! ): [AvailabilitySlot]
    }
    
    type Mutation {
        createAvailabilitySlot(input: AvailabilityInput!): ID
        updateAvailabilitySlot(id: ID!, input: AvailabilityInput!): AvailabilitySlot
        deleteAvailabilitySlot(id: ID!): Boolean
    }
`;