/**
 * equipmentInstanceSchema.ts
 * GraphQL declarations for EquipmentInstances
 */

import {gql} from "graphql-tag";

export const EquipmentInstanceTypeDefs = gql`
    type EquipmentInstance {
        id: ID
        equipment: Equipment!
        name: String!
        status: String
    }

    type Equipment {
        id: ID!
        name: String
    }


    extend type Query {
        equipmentInstances(equipmentID: ID!): [EquipmentInstance]
    }

    extend type Mutation {
        createEquipmentinstance(equipmentID: ID!, name: String!): EquipmentInstance
        setInstanceStatus(id: ID!, status: String!): EquipmentInstance
        setInstanceName(id: ID!, name: String!): EquipmentInstance
        deleteInstance(id: ID!): Boolean
        assignReaderToEquipmentInstance(id: ID!): Boolean
        
    }
`