import moment from "moment";
import { knex } from "../../db/index.js";
import {  DataPointsRow, EquipmentSessionRow } from "../../db/tables.js";
import { getRooms } from "../Rooms/RoomRepository.js";
moment().format(); 

export interface RoomSwipesByRoomByWeekDayByHour {
    day: string;
    roomID: number;
        
    data: {
        hour: string;
        sum: number;
        avg: number;
    }[]
}


/**
 * Get Equipment Session by the day of the week in the start timestamp
 * @param dayOfTheWeek abbreviated string format (i.e. mon, wed)
 * @returns 
 */
export async function getEquipmentSessionsByDayOfTheWeek(dayOfTheWeek: string, startDate: string, stopDate: string): Promise<EquipmentSessionRow[]> {
 return await knex("EquipmentSessions").select().where(knex.raw(`to_char("start", 'dy') = ${dayOfTheWeek}`)).andWhereBetween(`("dateTime" at time zone 'EST5EDT')`, [startDate, stopDate]);
}

export async function getCummRoomSwipesByRoomByWeekDayByHour(startDate: string, stopDate: string): Promise<RoomSwipesByRoomByWeekDayByHour[]> {
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    const rooms = await getRooms();

    const startMoment = moment(startDate);
    const stopMoment = moment(stopDate);

    const diff = moment.duration(startMoment.diff(stopMoment));

    const diffWeeks = Math.floor(Math.abs(diff.asWeeks())) > 0 ? Math.floor(Math.abs(diff.asWeeks())) : 1;

    const results: RoomSwipesByRoomByWeekDayByHour[] = [];

    for (var i = 0; i < weekDays.length; i++) {
        //This query can be written with a loop, but it's best to try to limit server processing here

        //IMPORTANT: Knex will fix the timezones in queries made with knex syntax. It will *NOT* do do this with knex.raw content
        //Use ("dateTime" at time zone 'EST5EDT') as an alternative
        const sums = await knex("RoomSwipes")
            .where(knex.raw(`("dateTime" at time zone 'EST5EDT') BETWEEN '${new Date(startDate).toISOString().split('T')[0]}' AND '${new Date(stopDate).toISOString().split('T')[0]}'`))
            .select(knex.raw(`"roomID",
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '8' THEN 1 ELSE 0 END) AS count_8,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '9' THEN 1 ELSE 0 END) AS count_9,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '10' THEN 1 ELSE 0 END) AS count_10,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '11' THEN 1 ELSE 0 END) AS count_11,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '12' THEN 1 ELSE 0 END) AS count_12,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '13' THEN 1 ELSE 0 END) AS count_13,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '14' THEN 1 ELSE 0 END) AS count_14,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '15' THEN 1 ELSE 0 END) AS count_15,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '16' THEN 1 ELSE 0 END) AS count_16,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '17' THEN 1 ELSE 0 END) AS count_17,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '18' THEN 1 ELSE 0 END) AS count_18,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '19' THEN 1 ELSE 0 END) AS count_19,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '20' THEN 1 ELSE 0 END) AS count_20,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '21' THEN 1 ELSE 0 END) AS count_21,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '22' THEN 1 ELSE 0 END) AS count_22,
                SUM(CASE WHEN to_char(("dateTime" at time zone 'EST5EDT'), 'HH24') = '23' THEN 1 ELSE 0 END) AS count_23
            `))
            .where(knex.raw(`to_char(("dateTime" at time zone 'EST5EDT'), 'dy') = '${weekDays[i]}'`))
            .groupBy("roomID")
            .orderBy("roomID")
            // Promise contains data entries which each contain a Promise which contains a data entry
            // Don't know why
            // IDE Interpreter will call this an error. It is not.
            // Don't know why
            .then(result => {
                var providedRoomIDs: number[] = [];
                result.forEach(function(countResult: any) {
                    providedRoomIDs.push(countResult.roomID);
                    const newResultEntry: RoomSwipesByRoomByWeekDayByHour = {
                        day: weekDays[i],
                        roomID: countResult.roomID,
                        data: [
                            {hour: "8:00", sum: Number(countResult.count_8), avg: Number(countResult.count_8) / diffWeeks},
                            {hour: "9:00", sum: Number(countResult.count_9), avg: Number(countResult.count_9) / diffWeeks},
                            {hour: "10:00", sum: Number(countResult.count_10), avg: Number(countResult.count_10) / diffWeeks},
                            {hour: "11:00", sum: Number(countResult.count_11), avg: Number(countResult.count_11) / diffWeeks},
                            {hour: "12:00", sum: Number(countResult.count_12), avg: Number(countResult.count_12) / diffWeeks},
                            {hour: "13:00", sum: Number(countResult.count_13), avg: Number(countResult.count_13) / diffWeeks},
                            {hour: "14:00", sum: Number(countResult.count_14), avg: Number(countResult.count_14) / diffWeeks},
                            {hour: "15:00", sum: Number(countResult.count_15), avg: Number(countResult.count_15) / diffWeeks},
                            {hour: "16:00", sum: Number(countResult.count_16), avg: Number(countResult.count_16) / diffWeeks},
                            {hour: "17:00", sum: Number(countResult.count_17), avg: Number(countResult.count_17) / diffWeeks},
                            {hour: "18:00", sum: Number(countResult.count_18), avg: Number(countResult.count_18) / diffWeeks},
                            {hour: "19:00", sum: Number(countResult.count_19), avg: Number(countResult.count_19) / diffWeeks},
                            {hour: "20:00", sum: Number(countResult.count_20), avg: Number(countResult.count_20) / diffWeeks},
                            {hour: "21:00", sum: Number(countResult.count_21), avg: Number(countResult.count_21) / diffWeeks},
                            {hour: "22:00", sum: Number(countResult.count_22), avg: Number(countResult.count_22) / diffWeeks},
                            {hour: "23:00", sum: Number(countResult.count_23), avg: Number(countResult.count_23) / diffWeeks},
                        ]
                    };
                    results.push(newResultEntry);
                })
                //Append rooms with no data
                rooms.forEach((room: {id: number}) => {
                    if (!providedRoomIDs.includes(room.id)) {
                        results.push(
                            {
                                day: weekDays[i],
                                roomID: room.id,
                                data: [
                                    {hour: "8:00", sum: 0, avg: 0 },
                                    {hour: "9:00", sum: 0, avg: 0 },
                                    {hour: "10:00", sum: 0, avg: 0 },
                                    {hour: "11:00", sum: 0, avg: 0 },
                                    {hour: "12:00", sum: 0, avg: 0 },
                                    {hour: "13:00", sum: 0, avg: 0 },
                                    {hour: "14:00", sum: 0, avg: 0 },
                                    {hour: "15:00", sum: 0, avg: 0 },
                                    {hour: "16:00", sum: 0, avg: 0 },
                                    {hour: "17:00", sum: 0, avg: 0 },
                                    {hour: "18:00", sum: 0, avg: 0 },
                                    {hour: "19:00", sum: 0, avg: 0 },
                                    {hour: "20:00", sum: 0, avg: 0 },
                                    {hour: "21:00", sum: 0, avg: 0 },
                                    {hour: "22:00", sum: 0, avg: 0 },
                                    {hour: "23:00", sum: 0, avg: 0 },
                                ]
                            }
                        )
                    }
                })
        });
    };

    return results;
}



export async function getNumUsersRegisteredToday(): Promise<number | undefined> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(0, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate()+1);
    //Length is Best option right now because for some reason knex does not do count correctly
    //This one wont work if you explicitly state the timezone or timestamp type. I have no idea why. I give up.
    return (await knex("Users").whereRaw(`("registrationDate") BETWEEN '${startOfDay.toISOString().replace("T", " ").replace("Z", "")}' AND '${endOfDay.toISOString().replace("T", " ").replace("Z", "")}'`)).length;
}

export async function getNumRoomSwipesToday(): Promise<number | undefined> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(0, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate()+1);
    //Length is Best option right now because for some reason knex does not do count correctly
    return (await knex("RoomSwipes").whereRaw(`("dateTime") BETWEEN '${startOfDay.toISOString().replace("T", " ").replace("Z", "")}' AND '${endOfDay.toISOString().replace("T", " ").replace("Z", "")}-04'`)).length;
}

export async function getNumEquipmentSessionsToday(): Promise<number | undefined> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(0, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate()+1);
    //Length is Best option right now because for some reason knex does not do count correctly
    return (await knex("EquipmentSessions").whereRaw(`("start") BETWEEN '${startOfDay.toISOString().replace("T", " ").replace("Z", "")}' AND '${endOfDay.toISOString().replace("T", " ").replace("Z", "")}'`)).length;
}