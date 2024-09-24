import { gql } from "graphql-tag";

export const StatisticQueryTypeDefs = gql`
    type RoomSwipeStats {
        day: String
        roomID: ID
        data: [HourStats]
    }

    type HourStats {
        hour: String!
        sum: Float
        avg: Float
    }

    type Count {
        count: Int
    }

    type ModuleStats {
        moduleID: ID!
        moduleName: String!
        passedSum: Int
        failedSum: Int
    }

    extend type Query {
        equipmentSessionsByDayOfTheWeek(dayOfTheWeek: String!, startDate: String, stopDate: String): String
        sumRoomSwipesByRoomByWeekDayByHour(sumStartDate: String, sumStopDate: String, avgStartDate: String, avgStopDate: String): [RoomSwipeStats]
        numNewUsersToday: Int
        numRoomSwipesToday: Int
        numEquipmentSessionsToday: Int
        moduleScores(startDate: String, stopDate: String): [ModuleStats]
    }
`;