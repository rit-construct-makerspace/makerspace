import React, { useEffect, useState } from "react";
import { Button, Card, CardActionArea, CardContent, CardMedia, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Room from "../../../types/Room";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import ZoneHour from "../../../types/Room";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import Privilege from "../../../types/Privilege";
import LoadingButton from "@mui/lab/LoadingButton";
import ZoneHourRow from "./ZoneHourRow";

export const GET_ZONE_HOURS = gql`
  query GetZoneHours {
    zoneHours {
      id
      zone
      type
      dayOfTheWeek
      time
    }
  }
`;

const ADD_ZONE_HOURS = gql`
  mutation AddZoneHours($zone: String!, $type: String!, $dayOfTheWeek: String!, $time: String!) {
    addZoneHours(zone: $zone, type: $type, dayOfTheWeek: $dayOfTheWeek, time: $time) {
      id
    }
  }
`;

export default function ZoneHourOptions() {
  const navigate = useNavigate();
  const getZoneHoursResult = useQuery(GET_ZONE_HOURS);
  const [addZoneHours, result] = useMutation(ADD_ZONE_HOURS);

  const currentUser = useCurrentUser();

  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [deleteID, setDeleteID] = useState(0);

  const handleSubmit = () => {
    if (!zone) {
      window.alert("Please set the zone.");
      return;
    }

    if (!type) {
      window.alert("Please select the type.");
      return;
    }

    if (!day) {
      window.alert("Please select the day of the week");
      return;
    }

    if (!time) {
      window.alert("Please select the time.");
      return;
    }

    addZoneHours({
      variables: {
        zone,
        type,
        dayOfTheWeek: day,
        time
      },
      refetchQueries: [{ query: GET_ZONE_HOURS }],
    });
  };

  return (
    <Card>
      <CardContent>
        <RequestWrapper
          loading={getZoneHoursResult.loading}
          error={getZoneHoursResult.error}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Zone
                </TableCell>
                <TableCell>
                  Type
                </TableCell>
                <TableCell>
                  Day
                </TableCell>
                <TableCell>
                  Time
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getZoneHoursResult.data != null && getZoneHoursResult.data.zoneHours.map((zoneHour: ZoneHour) => (
                <ZoneHourRow id={zoneHour.id} zone={zoneHour.zone} type={zoneHour.type} dayOfTheWeek={zoneHour.dayOfTheWeek} time={zoneHour.time}></ZoneHourRow>
              ))}

              <TableRow>
                <TableCell>
                  <TextField
                    label="Zone (ex: 1,2,3)"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  >
                  </TextField>
                </TableCell>
                <TableCell>
                  <Select
                    value={type}
                    label="Type"
                    onChange={(e) => setType(e.target.value)}
                    fullWidth={true}
                  >
                    <MenuItem value={"OPEN"}>OPEN</MenuItem>
                    <MenuItem value={"CLOSE"}>CLOSE</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={day}
                    label="Day"
                    onChange={(e) => setDay(String(e.target.value))}
                    fullWidth={true}
                  >
                    <MenuItem value={1}>Sunday</MenuItem>
                    <MenuItem value={2}>Monday</MenuItem>
                    <MenuItem value={3}>Tuesday</MenuItem>
                    <MenuItem value={4}>Wednesday</MenuItem>
                    <MenuItem value={5}>Thursday</MenuItem>
                    <MenuItem value={6}>Friday</MenuItem>
                    <MenuItem value={7}>Saturday</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    label=""
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    fullWidth={true}
                  >
                  </TextField>
                </TableCell>
                <TableCell>
                <LoadingButton
                  loading={result.loading}
                  disabled={currentUser.privilege !== Privilege.STAFF}
                  size="large"
                  color="success"
                  variant="outlined"
                  onClick={handleSubmit}
                  sx={{ alignSelf: "flex-end" }}
                >
                  Create New
                </LoadingButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </RequestWrapper>
      </CardContent>
    </Card>
  );
}
