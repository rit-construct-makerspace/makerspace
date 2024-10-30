import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { GET_ANY_EQUIPMENT_BY_ID, GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import GET_ROOMS from "../../../queries/getRooms";
import { useQuery } from "@apollo/client";
import TimeAgo from 'react-timeago'
import { blue } from "@mui/material/colors";

interface ReaderCardProps {
    id: number,
    machineID: number,
    machineType: string,
    name: string,
    zone: string
    temp: number,
    state: string,
    userID: number | null,
    userName: string | null,
    recentSessionLength: number,
    lastStatusReason: string,
    scheduledStatusFreq: number,
    lastStatusTime: string,
    helpRequested: boolean,
    BEVer?: string,
    FEVer?: string,
    HWVer?: string
}

const useStyles = makeStyles({
  errorText: {
    color: "red",
    fontWeight: "bold"
  },
  errorCard: {
    border: "3px solid red"
  },
  notifCard: {
    border: "3px solid blue"
  }
});

export default function ReaderCard({ id, machineID, machineType, name, zone, temp, state, userID, userName, recentSessionLength, lastStatusReason, scheduledStatusFreq , lastStatusTime, helpRequested, BEVer, FEVer, HWVer }: ReaderCardProps) {
  const stateContent = state === "Active" ? (
    <p>Current User: <AuditLogEntity entityCode={`user:${userID}:${userName}`}></AuditLogEntity><br></br>Session Length: {recentSessionLength} sec</p>
  ) : (
    <p>Last User: {userID != null ? (<AuditLogEntity entityCode={`user:${userID}:${userName}`}></AuditLogEntity>) : "NULL"}<br></br>Session Length: {recentSessionLength} sec</p>
  );

  const machineResult = useQuery(GET_ANY_EQUIPMENT_BY_ID, {
    variables: { id: machineID }
  });

  const rooms = useQuery(GET_ROOMS);

  const classes = useStyles();

  const now = new Date();
  const lastTimeDifference = now.getTime() - (new Date(lastStatusTime).getTime());

  return (
    <RequestWrapper
    loading={machineResult.loading}
    error={machineResult.error}
    >
      <Card sx={{ width: 350, minHeight: 600}} className={(lastStatusReason == "Error" || lastStatusReason == "Temperature" ? classes.errorCard : "") + (helpRequested ? classes.notifCard : "")}>
        <CardHeader
          title={name}
          subheader={"Type: " + machineType}
        >
        </CardHeader>
        <CardContent>
          <Typography
            variant="body2"
            component="div"
            sx={{ lineHeight: 1, mb: 1 }}
          >
            <b>Device ID: </b>{id}
            <br></br>
            <br></br>
            <b>Zone(s): </b>
            {
              zone.split(",").map(function(zoneStr) {
                const zoneNum = parseInt(zoneStr);
                const code = rooms.data == undefined ? "0:none:none" : "room:" + zoneNum + ":" + rooms.data.rooms.find((room: { id: number; }) => room.id == zoneNum).name;
                return (
                  <div><AuditLogEntity entityCode={code}></AuditLogEntity><br></br></div>
                )
              })
            }
            <br></br>
            <b>Machine: </b> <AuditLogEntity entityCode={machineID == undefined || machineResult.data == undefined ? "0:none:none" : "equipment:" + machineResult.data.anyEquipment.id + ":" + machineResult.data.anyEquipment.name}></AuditLogEntity>

            <br></br>
          </Typography>
          <Card variant="outlined">
            <CardContent>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ lineHeight: 1, mb: 1 }}
                    noWrap
                >
                    Temp (&#176;C)
                </Typography>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{ lineHeight: 1, mb: 1 }}
                    align="center"
                    noWrap
                >
                    {temp}
                </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
            <Typography
                    variant="h6"
                    component="div"
                    sx={{ lineHeight: 1, mb: 1 }}
                    noWrap
                >
                    State
                </Typography>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ lineHeight: 1, mb: 1 }}
                    noWrap
                    align="center"
                >
                    {state == null ? "NULL" : state}
                    {helpRequested && 
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ lineHeight: 1, mb: 1, color: "blue" }}
                      noWrap
                      align="center"
                    >
                      Help Requested!
                    </Typography>}
                </Typography>
            </CardContent>
          </Card>
          <br />
          <Typography
              variant="body2"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
              noWrap
          >
              <b>Last Status:</b> <span style={{fontWeight: lastTimeDifference > 60000 ? 'bold' : 'regular', color:  lastTimeDifference > 60000 ? 'red' : 'inherit'}}><TimeAgo date={lastStatusTime} locale="en-US"/></span> - <b>Reason:</b> <span className={lastStatusReason == "Error" || lastStatusReason == "Temperature" ? classes.errorText : ""}>{lastStatusReason}</span><br></br>
              <b>Regular Status Interval:</b> {scheduledStatusFreq} sec
          </Typography>
          <Typography
              variant="body2"
              component="div"
              sx={{ lineHeight: 1, mb: 1 }}
              noWrap
          >
              {stateContent}
          </Typography>
          <Box>
            <Stack direction={"column"} spacing={0.5} color={"secondary"} mt={1}>
              <Typography variant="body2"><b>BEVer:</b> {BEVer ?? "NULL"}</Typography>
              <Typography variant="body2"><b>FEVer:</b> {FEVer ?? "NULL"}</Typography>
              <Typography variant="body2"><b>HWVer:</b> {HWVer ?? "NULL"}</Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </RequestWrapper>
  );
}
