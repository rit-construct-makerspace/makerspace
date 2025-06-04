import React, { ChangeEvent, useEffect, useState } from "react";
import Page from "../../Page";
import { Alert, Box, Button, CardContent, CardHeader, FormControl, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import CountCard from "./CountCard";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import AdminPage from "../../AdminPage";
import { Card } from "@material-ui/core";
import { BarChart, Gauge, LineChart } from "@mui/x-charts";
import RequestWrapper from "../../../common/RequestWrapper";
import TimeAgo from 'react-timeago'
import GET_ROOMS from "../../../queries/roomQueries";
import { GET_EQUIPMENT_SESSIONS, GET_MODULE_SCORES, GET_NUM_EQUIPMENT_SESSIONS_TODAY, GET_NUM_NEW_USERS, GET_NUM_ROOM_SWIPES_TODAY, GET_NUM_SITE_VISITS, GET_ROOM_SWIPE_COUNTS, GET_ZONE_HOURS } from "./statisticsQueries";


function getMonthToPresentBounds(): { startOfMonth: Date, today: Date } {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return { startOfMonth, today };
}

function getSunday() {
  var d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}




export default function StatisticsPage() {
  const { startOfMonth, today } = getMonthToPresentBounds();
  const startOfWeek = getSunday();

  //Date range used for fetching the sums present in the graphs
  const [sumStartDate, setSumStartDate] = useState(startOfWeek);
  const [sumStopDate, setSumStopDate] = useState(today);

  //Date range used for fetching the averages present in the graphs
  const [avgStartDate, setAvgStartDate] = useState(startOfMonth);
  const [avgStopDate, setAvgStopDate] = useState(today);

  //Date range used for fetching the equipment session statistics
  const [sessionsStartDate, setSessionsStartDate] = useState(startOfMonth);
  const [sessionsStopDate, setSessionsStopDate] = useState(today)

  //The day of the week to currently show graphs for
  const [viewDay, setViewDay] = useState("Sunday");

  //Date range used for fetching the training statistics
  const [trainingStartDate, setTrainingStartDate] = useState(startOfMonth);
  const [trainingStopDate, setTrainingStopDate] = useState(today)


  //const getNumNewUsersTodayResult = useQuery(GET_NUM_NEW_USERS, {variables: {dayRange}});
  const getNumSiteVisitsTodayResult = useQuery(GET_NUM_SITE_VISITS);
  const getNumNewUsersToday = useQuery(GET_NUM_NEW_USERS);
  const getNumRoomSwipesToday = useQuery(GET_NUM_ROOM_SWIPES_TODAY);
  const getNumEquipmentSessionsToday = useQuery(GET_NUM_EQUIPMENT_SESSIONS_TODAY);
  const getZoneHours = useQuery(GET_ZONE_HOURS)


  const [getEquipmentSessions, getEquipmentSessionsResult] = useLazyQuery(GET_EQUIPMENT_SESSIONS, {
    variables: {
      startDate: sessionsStartDate,
      stopDate: sessionsStopDate
    }
  });

  const [getSumRoomSwipesByRoomByWeekDayByHour, getSumRoomSwipesByRoomByWeekDayByHourResult] = useLazyQuery(GET_ROOM_SWIPE_COUNTS, {
    variables: {
      sumStartDate, sumStopDate,
      avgStartDate, avgStopDate
    }
  });

  const [getModuleScores, getModuleScoresResult] = useLazyQuery(GET_MODULE_SCORES, {
    variables: {
      startDate: trainingStartDate,
      stopDate: trainingStopDate
    }
  });

  const getRoomsResult = useQuery(GET_ROOMS);

  //Parse table data into format:
  // [{day: "mon", roomID: 0, hours: ["8:00", "9:00", ...], sums: [1, 2, ...], avgs: [1, 2, ...]}, ...]
  var tableData: { day: string, roomID: number, hours: string[], sums: number[], avgs: number[] }[] = [];
  if (!getSumRoomSwipesByRoomByWeekDayByHourResult.loading && !getSumRoomSwipesByRoomByWeekDayByHourResult.error && getSumRoomSwipesByRoomByWeekDayByHourResult.data != undefined) {
    getSumRoomSwipesByRoomByWeekDayByHourResult.data.sumRoomSwipesByRoomByWeekDayByHour.forEach(function () {
      const index = tableData.push({ day: "", roomID: 0, hours: [], sums: [], avgs: [] }) - 1;
      tableData[index].day = getSumRoomSwipesByRoomByWeekDayByHourResult.data.sumRoomSwipesByRoomByWeekDayByHour[index].day ?? "";
      tableData[index].roomID = getSumRoomSwipesByRoomByWeekDayByHourResult.data.sumRoomSwipesByRoomByWeekDayByHour[index].roomID ?? 0;
      getSumRoomSwipesByRoomByWeekDayByHourResult.data.sumRoomSwipesByRoomByWeekDayByHour[index].data.forEach(function (entry: { hour: string, sum: number, avg: number }) {
        if (entry == null) {
          return;
        }
        tableData[index].hours.push(entry.hour);
        tableData[index].sums.push(entry.sum);
        tableData[index].avgs.push(entry.avg);
      });
    });
  }

  const handleViewDayChange = (event: SelectChangeEvent) => {
    setViewDay(event.target.value);
  };

  const handleSumStartDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSumStartDate(new Date(event.target.value));
  };

  const handleSumStopDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSumStopDate(new Date(event.target.value));
  };

  const handleAvgStartDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAvgStartDate(new Date(event.target.value));
  };

  const handleAvgStopDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAvgStopDate(new Date(event.target.value));
  };

  const handleSessionsStartDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSessionsStartDate(new Date(event.target.value));
  };

  const handleSessionsStopDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSessionsStopDate(new Date(event.target.value));
  };

  const handleTrainingStartDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTrainingStartDate(new Date(event.target.value));
  };

  const handleTrainingStopDateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTrainingStopDate(new Date(event.target.value));
  };

  function findZoneHours(zoneHours: any[], type: string, zoneID: number | null, start: Date) {
    if (!zoneID) {
      if (type == "OPEN") return process.env.REACT_APP_DEFAULT_STAT_OPEN_TIME ?? "7:00:00";
      else return process.env.REACT_APP_DEFAULT_STAT_CLOSE_TIME ?? "23:00:00";
    }
    const result = zoneHours.find((zoneHour: { zoneID: number, type: string, dayOfTheWeek: number, time: number }) =>
      zoneHour.zoneID == zoneID
      && zoneHour.dayOfTheWeek == new Date(start).getDay()
      && zoneHour.type == type
    );
    if (!result) {
      if (type == "OPEN") return process.env.REACT_APP_DEFAULT_STAT_OPEN_TIME ?? "7:00:00";
      else return process.env.REACT_APP_DEFAULT_STAT_CLOSE_TIME ?? "23:00:00";
    }
    return result.time
  }

  function sameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  function averageEquipmentActiveTime(equipmentSessions: {
    id: number, start: Date, sessionLength: number, readerSlug: string, equipment: { id: number, name: string }, zone: { id: number, name: string }
  }[]) {
    if (equipmentSessions == undefined || equipmentSessions.length == 0 || getZoneHours.data == undefined) {
      return []
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysBetweenStartAndStop = Math.round(Math.abs((sessionsStartDate.getTime() - sessionsStopDate.getTime()) / oneDay));

    var machineActiveTimes: { readerSlug: string, timeActive: number, maximumTimeActive: number, numSessions: number, averageActiveTime: number, averageDailySessions: number, numSessionsToday: number }[] = [];
    equipmentSessions.forEach((session) => {
      //Find the time the machine is first available

      const openTime: Date = new Date();
      var timeString = findZoneHours(getZoneHours.data.zoneHours, "OPEN", session.zone ? session.zone.id : null, session.start);
      var parts = timeString.split(":")
      openTime.setHours(parts[0]);
      openTime.setMinutes(parts[1]);
      //Find the time the machine is no longer available
      var closeTime: Date = new Date();
      timeString = findZoneHours(getZoneHours.data.zoneHours, "CLOSE", session.zone ? session.zone.id : null, session.start);
      parts = timeString.split(":");
      closeTime.setHours(parts[0]);
      closeTime.setMinutes(parts[1]);

      //Find the maximum time a machine could be used
      const secondsOpen = (closeTime.getTime() - openTime.getTime()) / 1000;


      //If theres already an entry for this machine, add the active time to it
      //If not, make a new entry

      const existingActiveTimeEntryIndex = machineActiveTimes.findIndex((entry) => entry.readerSlug == session.readerSlug);

      if (existingActiveTimeEntryIndex == -1) {
        machineActiveTimes.push({
          readerSlug: session.readerSlug,
          timeActive: session.sessionLength,
          maximumTimeActive: secondsOpen,
          numSessions: 1,
          averageActiveTime: session.sessionLength,
          averageDailySessions: 1 / daysBetweenStartAndStop,
          numSessionsToday: (sameDay(new Date(session.start), new Date()) ? 1 : 0)
        });
      }
      else {
        machineActiveTimes[existingActiveTimeEntryIndex].timeActive += session.sessionLength;
        machineActiveTimes[existingActiveTimeEntryIndex].numSessions += 1;
        machineActiveTimes[existingActiveTimeEntryIndex].averageActiveTime = machineActiveTimes[existingActiveTimeEntryIndex].timeActive / machineActiveTimes[existingActiveTimeEntryIndex].numSessions;
        machineActiveTimes[existingActiveTimeEntryIndex].averageDailySessions = machineActiveTimes[existingActiveTimeEntryIndex].numSessions / daysBetweenStartAndStop;
        machineActiveTimes[existingActiveTimeEntryIndex].numSessionsToday += (sameDay(new Date(session.start), new Date()) ? 1 : 0);
      }
    });
    return machineActiveTimes;
  }

  function secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour\n " : " hours\n ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute\n " : " minutes\n ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    if (hDisplay + mDisplay + sDisplay == "") {
      if (d > 0 && d < 1) return "<1 second";
      return "N/A";
    }
    return hDisplay + mDisplay + sDisplay;
  }

  return (
    <AdminPage>
      <Box margin="25px">
      <Typography variant="h4">Statisitcs</Typography>
      <Box>
        <Typography variant="h4">Today's Numbers</Typography>
        <Stack direction={"row"} flexWrap={"wrap"}>
          <RequestWrapper loading={getNumSiteVisitsTodayResult.loading} error={getNumSiteVisitsTodayResult.error}>
            <CountCard label="Site Visits" count={getNumSiteVisitsTodayResult.data?.dailySiteVisits.value} unit="visits"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={getNumRoomSwipesToday.loading} error={getNumRoomSwipesToday.error}>
            <CountCard label="Room Sign-ins" count={getNumRoomSwipesToday.data?.numRoomSwipesToday} unit="sign-ins"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={getNumEquipmentSessionsToday.loading} error={getNumEquipmentSessionsToday.error}>
            <CountCard label="Equipment Uses*" count={getNumEquipmentSessionsToday.data?.numEquipmentSessionsToday} unit="activations"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={getNumNewUsersToday.loading} error={getNumNewUsersToday.error}>
            <CountCard label="New users" count={getNumNewUsersToday.data?.numNewUsersToday} unit="users"></CountCard>
          </RequestWrapper>
        </Stack>
        <Typography variant="body2">* Only counts ACS-connected equipment</Typography>
      </Box>

      <Box mt={5}>
        <Typography variant="h4">Room Usage</Typography>

        <FormControl sx={{ maxWidth: 800 }}>
          <Stack direction={"row"} spacing={10}>
            <FormGroup>
              <Typography sx={{ m: 1 }}>Graph Sum Range: </Typography>
              <Stack direction={"row"}>
                <TextField
                  defaultValue={startOfWeek.toISOString().split('T')[0]}
                  label="Start"
                  type="date"
                  onChange={handleSumStartDateChange}
                />
                <p> - </p>
                <TextField
                  defaultValue={today.toISOString().split('T')[0]}
                  label="Stop"
                  type="date"
                  onChange={handleSumStopDateChange}
                />
              </Stack>
            </FormGroup>
            <FormGroup>
              <Typography sx={{ m: 1 }}>Graph Average Range: </Typography>
              <Stack direction={"row"}>
                <TextField
                  defaultValue={startOfMonth.toISOString().split('T')[0]}
                  label="Start"
                  type="date"
                  onChange={handleAvgStartDateChange}
                />
                <p> - </p>
                <TextField
                  defaultValue={today.toISOString().split('T')[0]}
                  label="Stop"
                  type="date"
                  onChange={handleAvgStopDateChange}
                />
              </Stack>
            </FormGroup>
          </Stack>
          <Stack direction={"column"} spacing={2} alignItems={"center"} mt={5}>
            <Button
              sx={{ m: 1, width: 500 }}
              color="primary"
              variant="outlined"
              onClick={() => getSumRoomSwipesByRoomByWeekDayByHour({ variables: { sumStartDate, sumStopDate, avgStartDate, avgStopDate } })}
            >
              Fetch
            </Button>
            <Typography variant="body2" color={"warning"} textAlign={"center"}>The graphs may not appear once the Fetch button is pressed.<br></br>If this occurs, select a different weekday below to refresh the graphs.</Typography>
          </Stack>
        </FormControl>
        <Select
          sx={{ my: 2, minWidth: "100px", maxWidth: "715px", width: "50vw" }}
          defaultValue="mon"
          label="Weekday"
          onChange={handleViewDayChange}
        >
          <MenuItem value='sun' selected={true}>Sunday</MenuItem>
          <MenuItem value='mon'>Monday</MenuItem>
          <MenuItem value='tue'>Tuesday</MenuItem>
          <MenuItem value='wed'>Wednesday</MenuItem>
          <MenuItem value='thu'>Thursday</MenuItem>
          <MenuItem value='fri'>Friday</MenuItem>
          <MenuItem value='sat'>Saturday</MenuItem>
        </Select>

        <Stack direction={"column"}>
          <RequestWrapper loading={getRoomsResult.loading} error={getRoomsResult.error}>
            <RequestWrapper loading={getSumRoomSwipesByRoomByWeekDayByHourResult.loading} error={getSumRoomSwipesByRoomByWeekDayByHourResult.error}>
              {getRoomsResult.data?.rooms.map((room: { id: number, name: string }) => (
                <>
                  <Typography>Room {room.id}: {room.name}</Typography>
                  {tableData.filter((data) => data.roomID == room.id && data.day == "sun").map((roomTableData) => (
                    <div hidden={viewDay != 'sun'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdSun${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdSun${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "mon").map((roomTableData) => (
                    <div hidden={viewDay != 'mon'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdMon${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdMon${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "tue").map((roomTableData) => (
                    <div hidden={viewDay != 'tue'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdTue${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdTue${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "wed").map((roomTableData) => (
                    <div hidden={viewDay != 'wed'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdWed${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdWed${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "thu").map((roomTableData) => (
                    <div hidden={viewDay != 'thu'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdThu${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdThu${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "fri").map((roomTableData) => (
                    <div hidden={viewDay != 'fri'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdFri${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdFri${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                  {tableData.filter((data) => data.roomID == room.id && data.day == "sat").map((roomTableData) => (
                    <div hidden={viewDay != 'sat'}>
                      <BarChart
                        width={500}
                        height={300}
                        series={[
                          { data: roomTableData.avgs, label: 'Average', id: `avgIdSat${room.id}` },
                          { data: roomTableData.sums, label: 'Sum', id: `sumIdSat${room.id}` },
                        ]}
                        xAxis={[{ data: roomTableData.hours, scaleType: 'band' }]}
                      />
                    </div>
                  ))}
                </>

              ))}
            </RequestWrapper>
          </RequestWrapper>
        </Stack>
      </Box>
      <Box mt={5}>
        <Typography variant="h4">Equipment Usage</Typography>

        <Stack direction={"column"} sx={{ maxWidth: 800 }}>
          <Stack direction={"row"} spacing={10}>
            <FormGroup>
              <Typography sx={{ m: 1 }}>Range: </Typography>
              <Stack direction={"row"}>
                <TextField
                  defaultValue={startOfWeek.toISOString().split('T')[0]}
                  label="Start"
                  type="date"
                  onChange={handleSessionsStartDateChange}
                />
                <p> - </p>
                <TextField
                  defaultValue={today.toISOString().split('T')[0]}
                  label="Stop"
                  type="date"
                  onChange={handleSessionsStopDateChange}
                />
              </Stack>
            </FormGroup>
          </Stack>
          <Stack direction={"column"} spacing={2} alignItems={"center"} mt={5}>
            <Button
              sx={{ m: 1, width: 500 }}
              color="primary"
              variant="outlined"
              disabled
              onClick={() => {
                //getEquipmentSessions({ variables: { startDate: sessionsStartDate, stopDate: sessionsStopDate } });
              }}
            >
              Fetch (may take up to a minute)
            </Button>
            <Typography></Typography>
          </Stack>
        </Stack>

        <RequestWrapper loading={getEquipmentSessionsResult.loading} error={getEquipmentSessionsResult.error}>
          <Stack direction={"row"} flexWrap={"wrap"}>
            {getEquipmentSessionsResult.data != undefined && averageEquipmentActiveTime(getEquipmentSessionsResult.data?.equipmentSessions).map((entry) => (
              <Card variant="outlined" style={{ width: 250, margin: 5, padding: 5 }}>
                <CardHeader title={entry.readerSlug}></CardHeader>
                <CardContent>
                  <Grid>
                    <div>
                      <Typography>Total Sessions</Typography>
                      <Typography variant="h4">{entry.numSessions}</Typography>
                    </div>
                    <div>
                      <Typography>Time Active</Typography>
                      <Gauge width={150} height={150} value={(entry.timeActive / entry.maximumTimeActive) * 100} text={`${Math.round(entry.timeActive / 60)} min\n\n${(entry.timeActive / entry.maximumTimeActive * 100).toFixed(2)}0%`} />
                    </div>
                    <div>
                      <Typography>Average Session Length</Typography>
                      <Typography variant="h6">{secondsToHms(entry.averageActiveTime)}</Typography>
                    </div>
                    <div>
                      <Typography>Average Daily Sessions</Typography>
                      <Typography variant="h4">{entry.averageDailySessions.toFixed(1)}</Typography>
                    </div>
                    <div>
                      <Typography>Sessions Today</Typography>
                      <Typography variant="h4">{entry.numSessionsToday}</Typography>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </RequestWrapper>

      </Box>
      <Box mt={5}>
        <Typography variant="h4">Trainings</Typography>

        <Stack direction={"column"} sx={{ maxWidth: 800 }}>
          <Stack direction={"row"} spacing={10}>
            <FormGroup>
              <Typography sx={{ m: 1 }}>Range: </Typography>
              <Stack direction={"row"}>
                <TextField
                  defaultValue={startOfWeek.toISOString().split('T')[0]}
                  label="Start"
                  type="date"
                  onChange={handleTrainingStartDateChange}
                />
                <p> - </p>
                <TextField
                  defaultValue={today.toISOString().split('T')[0]}
                  label="Stop"
                  type="date"
                  onChange={handleTrainingStopDateChange}
                />
              </Stack>
            </FormGroup>
          </Stack>
          <Stack direction={"column"} spacing={2} alignItems={"center"} mt={5}>
            <Button
              sx={{ m: 1, width: 500 }}
              color="primary"
              variant="outlined"
              onClick={() => {
                getModuleScores({ variables: { startDate: trainingStartDate, stopDate: trainingStopDate } });
              }}
            >
              Fetch
            </Button>
            <Typography></Typography>
          </Stack>
        </Stack>

        <RequestWrapper loading={getModuleScoresResult.loading} error={getModuleScoresResult.error}>
          <Stack direction={"row"} flexWrap={"wrap"}>
            {getModuleScoresResult.data != undefined && getModuleScoresResult.data.moduleScores.map((entry: {moduleID: number, moduleName: string, passedSum: number, failedSum: number}) => (
              <Card variant="outlined" style={{ width: 250, margin: 5, padding: 5 }}>
                <CardHeader title={entry.moduleName}></CardHeader>
                <CardContent>
                  <Grid>
                    <div>
                      <Typography>Total Submissions</Typography>
                      <Typography variant="h4">{entry.passedSum + entry.failedSum}</Typography>
                    </div>
                    <div>
                      <Typography>Passing Rate</Typography>
                      <Gauge width={150} height={150} value={(entry.passedSum / Math.max((entry.passedSum + entry.failedSum),1)) * 100} text={`${((entry.passedSum / Math.max((entry.passedSum + entry.failedSum),1)) * 100).toFixed(2)}%`} />
                    </div>
                    <div>
                      <Typography>Passed</Typography>
                      <Typography variant="h4" color={"success"}>{entry.passedSum}</Typography>
                    </div>
                    <div>
                      <Typography>Failed</Typography>
                      <Typography variant="h4" color={"error"}>{entry.failedSum}</Typography>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </RequestWrapper>
      </Box>
      </Box>
    </AdminPage>
  );
}
