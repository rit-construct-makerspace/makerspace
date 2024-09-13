import { Privilege } from "../schemas/usersSchema.js";
import { ApolloContext } from "../context.js";
import { getDataPointByID, incrementDataPointValue, setDataPointValue } from "../repositories/DataPoints/DataPointsRepository.js";
import { getEquipmentSessionsByDayOfTheWeek, getCummRoomSwipesByRoomByWeekDayByHour, RoomSwipesByRoomByWeekDayByHour, getNumUsersRegisteredToday, getNumRoomSwipesToday, getNumEquipmentSessionsToday } from "../repositories/StatisticsQuery/StatisticQueryRepository.js";
import { getModules } from "../repositories/Training/ModuleRepository.js";
import { getModulePassedandFailedCount, getModulePassedandFailedCountWithModuleName } from "../repositories/Training/SubmissionRepository.js";

function getMonthToPresentBounds(): {startOfMonth: Date, today: Date} {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return {startOfMonth, today};
}

function getSunday() {
  var d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

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
    equipmentSessionsByDayOfTheWeek: async (
      _parent: any,
      args: {
        dayOfTheWeek: string, 
        sumStartDate: string, sumStopDate: string
      },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
        const {startOfMonth, today} = getMonthToPresentBounds();

        const sumStartDate = args.sumStartDate ?? startOfMonth;
        const sumStopDate = args.sumStopDate ?? today;
        return await getEquipmentSessionsByDayOfTheWeek(args.dayOfTheWeek, sumStartDate, sumStopDate);
      }),
      sumRoomSwipesByRoomByWeekDayByHour: async (
        _parent: any,
        args: {
          sumStartDate: string, sumStopDate: string
          avgStartDate: string, avgStopDate: string,
        },
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          const {startOfMonth, today} = getMonthToPresentBounds();
          const startOfWeek = getSunday();
          const startDate = args.sumStartDate && args.sumStartDate != "" ? args.sumStartDate : startOfWeek.toDateString();
          const stopDate = args.sumStopDate && args.sumStopDate != "" ? args.sumStopDate : today.toDateString();
          const avgStartDate = args.avgStartDate && args.avgStartDate != "" ? args.avgStartDate : startOfMonth.toDateString();
          const avgStopDate = args.avgStopDate && args.avgStopDate != "" ? args.avgStopDate : today.toDateString();

          const result = await getCummRoomSwipesByRoomByWeekDayByHour(startDate, stopDate);
          const avgResult = await getCummRoomSwipesByRoomByWeekDayByHour(avgStartDate, avgStopDate);

          const combinedResult = fitSeperateRangeAverages(result, avgResult);
          return await combinedResult;
      }),
      moduleScores: async (
        _parent: any,
        args: {startDate: string, stopDate: string},
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          const result = await getModulePassedandFailedCountWithModuleName(args.startDate, args.stopDate);
          return result
        }),
      numNewUsersToday: async (
        _parent: any,
        _args: any,
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          return await getNumUsersRegisteredToday();
        }),
      numRoomSwipesToday: async (
        _parent: any,
        _args: any,
        { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          return await getNumRoomSwipesToday();
        }),
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