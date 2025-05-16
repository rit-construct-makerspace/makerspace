/**
 * statisticQueryResolver
 * GraphQL ENdpoint Implementations for various statistical operations
 */

import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";
import { getEquipmentSessionsByDayOfTheWeek, getCummRoomSwipesByRoomByWeekDayByHour, RoomSwipesByRoomByWeekDayByHour, getNumUsersRegisteredToday, getNumRoomSwipesToday, getNumEquipmentSessionsToday } from "../repositories/StatisticsQuery/StatisticQueryRepository.js";
import { getModules } from "../repositories/Training/ModuleRepository.js";
import { getModulePassedandFailedCount, getModulePassedandFailedCountWithModuleName } from "../repositories/Training/SubmissionRepository.js";

//Get start of month and end of today as Dates
function getMonthToPresentBounds(): { startOfMonth: Date, today: Date } {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return { startOfMonth, today };
}

//Get the SUnday of the current week as a Date
function getSunday() {
  var d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

//Set "avg" property in result to the "avg" property in avgResult
async function fitSeperateRangeAverages(result: RoomSwipesByRoomByWeekDayByHour[], avgResult: RoomSwipesByRoomByWeekDayByHour[]): Promise<RoomSwipesByRoomByWeekDayByHour[]> {
  for (var i = 0; i < result.length; i++) {
    var dayEntryData = result[i].data;
    var averagesDayEntryData = avgResult[i] != null ? avgResult[i].data : null;
    if (!averagesDayEntryData) continue;
    for (var j = 0; j < dayEntryData.length; j++) {
      if (!averagesDayEntryData[i]) continue;
      dayEntryData[i].avg = averagesDayEntryData[i].avg
    }
  }
  return await result;
}

const StatisticQueryResolver = {
  Query: {
    

    /**
     * Fetch number of users who have registered today
     * @returns number of users
     */
    numNewUsersToday: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getNumUsersRegisteredToday();
      }),

    /**
     * Fetch number of room swipes for all rooms today
     * @returns number of room swipes
     */
    numRoomSwipesToday: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getNumRoomSwipesToday();
      }),

    /**
     * Fetch number of equipment sessions for all equipment today
     * @returns number of sessions
     */
    numEquipmentSessionsToday: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        return await getNumEquipmentSessionsToday();
      }),
  },
};

export default StatisticQueryResolver;