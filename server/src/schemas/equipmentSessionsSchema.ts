import {gql} from "graphql-tag";

export const EquipmentSessionTypeDefs = gql`
    type EquipmentSession {
        id: ID!
        start: String
        user: User
        sessionLength: Int
        readerSlug: String
        equipment: Equipment
        room: Room
        zone: Zone
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
    }

    type Equipment {
        id: ID!
        name: String
    }

    type Room {
        id: ID!
        name: String
    }

    type Zone {
        id: ID!
        name: String
    }


    extend type Query {
        equipmentSessions(startDate: String, stopDate: String): [EquipmentSession]
    }
`