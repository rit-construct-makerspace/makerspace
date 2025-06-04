import { useState } from "react";
import { Card, CardContent, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import ZoneHourRow from "./ZoneHourRow";
import ZoneHour from "../../types/Room"
import { useCurrentUser } from "../../common/CurrentUserProvider";
import RequestWrapper from "../../common/RequestWrapper";
import { isManagerFor } from "../../common/PrivilegeUtils";

export const GET_ZONE_HOURS = gql`
  query GetZoneHoursByZone($zoneID: ID!) {
    zoneHoursByZone(zoneID: $zoneID) {
      id
      zoneID
      type
      dayOfTheWeek
      time
    }
  }
`;

const ADD_ZONE_HOURS = gql`
  mutation AddZoneHours($zoneID: ID!, $type: String!, $dayOfTheWeek: String!, $time: String!) {
    addZoneHours(zoneID: $zoneID, type: $type, dayOfTheWeek: $dayOfTheWeek, time: $time) {
      id
    }
  }
`;

interface ZoneHourOptionsProps {
  zoneID: number
}

export default function ZoneHourOptions({zoneID}: ZoneHourOptionsProps) {
  const getZoneHoursResult = useQuery(GET_ZONE_HOURS, {variables: {zoneID}});
  const [addZoneHours, result] = useMutation(ADD_ZONE_HOURS);

  const currentUser = useCurrentUser();

  const [type, setType] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = () => {
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
        zoneID,
        type,
        dayOfTheWeek: day,
        time,
      },
      refetchQueries: [{ query: GET_ZONE_HOURS, variables: {zoneID} }],
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
              {getZoneHoursResult.data != undefined && getZoneHoursResult.data?.zoneHoursByZone.map((zoneHour: ZoneHour) => (
                <ZoneHourRow id={zoneHour.id} zoneID={zoneHour.zoneID} type={zoneHour.type} dayOfTheWeek={zoneHour.dayOfTheWeek} time={zoneHour.time}></ZoneHourRow>
              ))}

              <TableRow>
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
                  disabled={!isManagerFor(currentUser, zoneID)}
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
