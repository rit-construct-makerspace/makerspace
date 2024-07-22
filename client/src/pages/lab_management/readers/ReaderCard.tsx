import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
    lastStatusTime: string
}

export default function ReaderCard({ id, machineID, machineType, name, zone, temp, state, currentUID, recentSessionLength, lastStatusReason, scheduledStatusFreq , lastStatusTime }: ReaderCardProps) {
  const machineContent = machineID != undefined ? ", Machine: " + machineID : "";

  const stateContent = state === "Active" ? (
    "Current User: " + currentUID + "\nSession Length" + recentSessionLength
  ) : (
    "Last Session Length: " + recentSessionLength
  );

  return (
    <Card sx={{ width: 250 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
              <MoreVertIcon />
          </IconButton>
          }
          title={name}
          subheader={machineType}
      >
      </CardHeader>
      <CardContent>
        <Typography
          variant="body2"
          component="div"
          sx={{ lineHeight: 1, mb: 1 }}
          noWrap
        >
          Device ID: {id}, Zone(s): {zone}{machineContent}<br></br>
        </Typography>
        <Card variant="outlined">
          <CardContent>
              <Typography
                  variant="h6"
                  component="div"
                  sx={{ lineHeight: 1, mb: 1 }}
                  noWrap
              >
                  Temp
              </Typography>
              <Typography
                  variant="body2"
                  component="div"
                  sx={{ lineHeight: 1, mb: 1 }}
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
                  {state == null ? "NULL" : state}
              </Typography>
              <Typography
                  variant="body2"
                  component="div"
                  sx={{ lineHeight: 1, mb: 1 }}
                  noWrap
              >
                  
              </Typography>
          </CardContent>
              <Typography
                  variant="body2"
                  component="div"
                  sx={{ lineHeight: 1, mb: 1 }}
                  noWrap
              >
                  <b>Last Status:</b> {lastStatusTime == null ? "NULL" : lastStatusTime} - <b>Reason:</b> {lastStatusReason}<br></br>
                  <b>Regular Status Interval:</b> {scheduledStatusFreq}
              </Typography>
        </Card>
      </CardContent>
    </Card>
  );
}
