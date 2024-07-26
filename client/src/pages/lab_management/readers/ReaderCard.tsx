import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { GET_EQUIPMENT_BY_ID } from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import GET_ROOMS from "../../../queries/getRooms";
import { useQuery } from "@apollo/client";
import TimeAgo from 'react-timeago'
import useSound from 'use-sound';

interface ReaderCardProps {
    id: number,
    machineID: number,
    machineType: string,
    name: string,
    zone: string
    temp: number,
    state: string,
    currentUID: string,
    recentSessionLength: number,
    lastStatusReason: string,
    scheduledStatusFreq: number,
    lastStatusTime: string,
    helpRequested: boolean
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

export default function ReaderCard({ id, machineID, machineType, name, zone, temp, state, currentUID, recentSessionLength, lastStatusReason, scheduledStatusFreq , lastStatusTime, helpRequested }: ReaderCardProps) {
  const stateContent = state === "Active" ? (
    "Current User: " + currentUID + "\nSession Length" + recentSessionLength + " sec"
  ) : (
    "Last Session Length: " + recentSessionLength + " sec"
  );

  const machineResult = useQuery(GET_EQUIPMENT_BY_ID, {
    variables: { id: machineID }
  });

  const rooms = useQuery(GET_ROOMS);

  const classes = useStyles();

  const now = new Date();
  const lastTimeDifference = now.getTime() - (new Date(lastStatusTime).getTime());

  const audio = new Audio("../../../assets/help.mp3");

  return (
    <RequestWrapper
    loading={machineResult.loading}
    error={machineResult.error}
    >
      <Card onClick={audio} sx={{ width: 350, minHeight: 600}} className={(lastStatusReason == "Error" || lastStatusReason == "Temperature" ? classes.errorCard : "") + (helpRequested ? classes.notifCard : "")}>
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
            <b>Machine: </b> <AuditLogEntity entityCode={machineID == undefined || machineResult.data == undefined ? "0:none:none" : "equipment:" + machineResult.data.equipment.id + ":" + machineResult.data.equipment.name}></AuditLogEntity>

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
        </CardContent>
      </Card>
    </RequestWrapper>
  );
}
