import {gql} from "graphql-tag";

export interface MachineLog {
    id: number;
    dateTime: number;
    machineID: number;
    userID: number;
}

export interface MachineLogInput {
    dateTime: number;
    machineID: number;
    userID: number;
}

export const MachineLogTypeDefs = gql`
    type MachineLog {
        id: ID!
        dateTime: Int!
        machineID: ID!
        userID: ID!
    }
    
    input MachineLogInput {
        dateTime: Int!
        machineID: ID!
        userID: ID!
    }
    
    extend type Query {
        machineLogsByMachine( machineID: ID!): [MachineLog]
        machineLogsByUser( userID: ID! ): [MachineLog]
    }
    
    type Mutation {
        createMachineLog(input: MachineLogInput!): MachineLog
    }
`