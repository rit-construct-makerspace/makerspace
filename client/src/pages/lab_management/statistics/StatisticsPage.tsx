import React, { ChangeEvent, useEffect, useState } from "react";
import Page from "../../Page";
import { Alert, Box, Button, CardContent, CardHeader, FormControl, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import CountCard from "./CountCard";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import AdminPage from "../../AdminPage";
import RequestWrapper from "../../../common/RequestWrapper";
import TimeAgo from 'react-timeago'
import GET_ROOMS from "../../../queries/roomQueries";
import { GET_EQUIPMENT_SESSIONS, GET_MODULE_SCORES, GET_NUM_EQUIPMENT_SESSIONS_TODAY, GET_NUM_NEW_USERS, GET_NUM_ROOM_SWIPES_TODAY, GET_NUM_SITE_VISITS, GET_ROOM_SWIPE_COUNTS, GET_ZONE_HOURS } from "./statisticsQueries";
import { EquipmentStats } from "./equipment/EquipmentStats";
import { TrainingStats } from "./training/TrainingStats";


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


  //const getNumNewUsersTodayResult = useQuery(GET_NUM_NEW_USERS, {variables: {dayRange}});
  const getNumSiteVisitsTodayResult = useQuery(GET_NUM_SITE_VISITS);
  const getNumNewUsersToday = useQuery(GET_NUM_NEW_USERS);
  const getNumRoomSwipesToday = useQuery(GET_NUM_ROOM_SWIPES_TODAY);
  const getNumEquipmentSessionsToday = useQuery(GET_NUM_EQUIPMENT_SESSIONS_TODAY);

  function sameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
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
        <Typography variant="h4">Statistics</Typography>
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

        <EquipmentStats />
        <TrainingStats />
      </Box>

    </AdminPage>
  );
}
