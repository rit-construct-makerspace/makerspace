import gql from "graphql-tag";

export interface AvailabilitySlot {
    id: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    userID: number;
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