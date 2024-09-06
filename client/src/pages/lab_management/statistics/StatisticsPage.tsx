import React, { ChangeEvent, useEffect, useState } from "react";
import Page from "../../Page";
import { Box, Button, FormControl, FormGroup, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import CountCard from "./CountCard";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import AdminPage from "../../AdminPage";
import { Card } from "@material-ui/core";
import { BarChart, LineChart } from "@mui/x-charts";
import RequestWrapper from "../../../common/RequestWrapper";
import GET_ROOMS from "../../../queries/getRooms";


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


const GET_NUM_SITE_VISITS = gql`
  query GetNumSiteVisits {
    dailySiteVisits {
      value
    }
  }
`;

const GET_NUM_ROOM_SWIPES_TODAY = gql`
  query GetNumRoomSwipesToday {
    numRoomSwipesToday
  }
`;

const GET_NUM_EQUIPMENT_SESSIONS_TODAY = gql`
  query GetNumEquipmentSessionsToday {
    numEquipmentSessionsToday
  }
`;

const GET_NUM_NEW_USERS = gql`
  query GetNumNewUsersToday {
    numNewUsersToday
  }
`;

const GET_EQUIPMENT_SESSIONS_BY_DOW = gql`
  query GetEquipmentSessionsByDayOfTheWeek($dayOfTheWeek: String!) {
    equipmentSessionsByDayOfTheWeek(dayOfTheWeek: $dayOfTheWeek) {
      id
      start
      sessionLength
      readerSlug
      equipmentID
    }
  }
`;

const GET_ROOM_SWIPE_COUNTS = gql`
  query SumRoomSwipesByRoomByWeekDayByHour(
    $sumStartDate: String
    $sumStopDate: String
    $avgStartDate: String
    $avgStopDate: String
  ) {
    sumRoomSwipesByRoomByWeekDayByHour(
      sumStartDate: $sumStartDate
      sumStopDate: $sumStopDate
      avgStartDate: $avgStartDate
      avgStopDate: $avgStopDate
    ) {
      day
      roomID
      data {
        hour
        sum
        avg
      }
    }
  }
`;

export default function StatisticsPage() {
  const { startOfMonth, today } = getMonthToPresentBounds();
  const startOfWeek = getSunday();

  //Date range used for fetching the sums present in the graphs
  const [sumStartDate, setSumStartDate] = useState(startOfWeek);
  const [sumStopDate, setSumStopDate] = useState(today);

  //Date range used for fetching the averages present in the graphs
  const [avgStartDate, setAvgStartDate] = useState(startOfMonth);
  const [avgStopDate, setAvgStopDate] = useState(today);

  //The day of the week to currently show graphs for
  const [viewDay, setViewDay] = useState("Sunday");


  //const getNumNewUsersTodayResult = useQuery(GET_NUM_NEW_USERS, {variables: {dayRange}});
  const getNumSiteVisitsTodayResult = useQuery(GET_NUM_SITE_VISITS);
  const getNumNewUsersToday = useQuery(GET_NUM_NEW_USERS);
  const getNumRoomSwipesToday = useQuery(GET_NUM_ROOM_SWIPES_TODAY);
  const GetNumEquipmentSessionsToday = useQuery(GET_NUM_EQUIPMENT_SESSIONS_TODAY);

  const [getSumRoomSwipesByRoomByWeekDayByHour, getSumRoomSwipesByRoomByWeekDayByHourResult] = useLazyQuery(GET_ROOM_SWIPE_COUNTS, {
    variables: {
      sumStartDate, sumStopDate,
      avgStartDate, avgStopDate
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

  return (
    <AdminPage title="Statistics" maxWidth="1250px">
      <Box>
        <Typography variant="h4">Today's Numbers</Typography>
        <Stack direction={"row"} flexWrap={"wrap"}>
          <RequestWrapper loading={getNumSiteVisitsTodayResult.loading} error={getNumSiteVisitsTodayResult.error}>
            <CountCard label="Site Visits" count={getNumSiteVisitsTodayResult.data?.dailySiteVisits.value} unit="visits"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={getNumRoomSwipesToday.loading} error={getNumRoomSwipesToday.error}>
            <CountCard label="Room Sign-ins" count={getNumRoomSwipesToday.data?.numRoomSwipesToday} unit="sign-ins"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={GetNumEquipmentSessionsToday.loading} error={GetNumEquipmentSessionsToday.error}>
            <CountCard label="Equipment Uses*" count={GetNumEquipmentSessionsToday.data?.numEquipmentSessionsToday} unit="activations"></CountCard>
          </RequestWrapper>
          <RequestWrapper loading={getNumNewUsersToday.loading} error={getNumNewUsersToday.error}>
            <CountCard label="New users" count={getNumNewUsersToday.data?.numNewUsersToday} unit="users"></CountCard>
          </RequestWrapper>
        </Stack>
        <Typography variant="body2">* Only counts ACS-connected equipment</Typography>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h4">Room Usage</Typography>

        <FormControl>
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
          <Button
            color="primary"
            onClick={() => getSumRoomSwipesByRoomByWeekDayByHour({ variables: { sumStartDate, sumStopDate, avgStartDate, avgStopDate } })}
          >
            Fetch
          </Button>
        </FormControl>
        <Select
          sx={{my: 2, minWidth: "100px", maxWidth: "715px", width: "50vw"}}
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


    </AdminPage>
  );
}
