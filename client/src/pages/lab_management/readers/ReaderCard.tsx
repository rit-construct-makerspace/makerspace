import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import { GET_CORRESPONDING_MACHINE_BY_READER_ID_OR_MACHINE_ID } from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import GET_ROOMS from "../../../queries/roomQueries";
import { useQuery, useMutation } from "@apollo/client";
import TimeAgo from 'react-timeago'
import { SET_READER_STATE } from "../../../queries/readersQueries";

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
    HWVer?: string,
    SN?: string,
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


export default function ReaderCard({ id, machineID, machineType, name, zone, temp, state, userID, userName, recentSessionLength, lastStatusReason, scheduledStatusFreq , lastStatusTime, helpRequested, BEVer, FEVer, HWVer, SN }: ReaderCardProps) {
  const stateContent = state === "Active" ? (
    <p>Current User: <AuditLogEntity entityCode={`user:${userID}:${userName}`}></AuditLogEntity><br></br>Session Length: {recentSessionLength} sec</p>
  ) : (
    <p>Last User: {userID != null ? (<AuditLogEntity entityCode={`user:${userID}:${userName}`}></AuditLogEntity>) : "NULL"}<br></br>Session Length: {recentSessionLength} sec</p>
  );
  
  const machineResult = useQuery(GET_CORRESPONDING_MACHINE_BY_READER_ID_OR_MACHINE_ID, {
      variables: {readerid: id, id: machineID }
    });
  const machine = machineResult?.data?.correspondingEquipment;
    
  const rooms = useQuery(GET_ROOMS);
    
  const classes = useStyles();

  const now = new Date();
  const lastTimeDifference = now.getTime() - (new Date(lastStatusTime).getTime());

  const [setReaderState]= useMutation(SET_READER_STATE);
  const handleChange = (event: any) => {
    // If the value was the informational one, ignore it
    if (event.target.value === "State"){
      return;
    }
    setReaderState({variables: {id: id, state: event.target.value}});
  };
  return (
    <RequestWrapper
    loading={machineResult.loading}
    error={machineResult.error}
    >
      <Card sx={{ width: 350, minHeight: 600}} className={(lastStatusReason === "Error" || lastStatusReason === "Temperature" ? classes.errorCard : "") + (helpRequested ? classes.notifCard : "")}>
        <CardHeader
          title={name}
          subheader={(machineType != null && machineType !== "") ? ("Type: " + machineType) : `SN: ${SN}`}
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
            <b>Zone(s): </b>
            {
              zone?.split(",")?.map(function(zoneStr) {
                const zoneNum = parseInt(zoneStr);
                var code = "0:none:none:"
                if (rooms.data != null && zone != null && zone !== ''){
                  const room = rooms.data.rooms.find((room: { id: number; }) => Number(room.id) === zoneNum)
                  code = `room:${zoneNum}:${room.name}`    
                }
                return (
                  <span><AuditLogEntity entityCode={code}></AuditLogEntity><br></br></span>
                )
              })
            }
            <br></br>
            <b>Machine: </b> 
            {
              (machine) ? 
                <Link href={"/app/admin/equipment/"+(machine.archived ? "/archived" : "")+(machine.id)}> {machine.name}</Link>
                : "Not paired"
            }

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
              <b>Last Status:</b> <span style={{fontWeight: lastTimeDifference > 60000 ? 'bold' : 'regular', color:  lastTimeDifference > 60000 ? 'red' : 'inherit'}}><TimeAgo date={lastStatusTime} locale="en-US"/></span> - <b>Reason:</b> <span style={(lastStatusReason == "Error" || lastStatusReason == "Temperature") ? styles.errorText : {}}>{lastStatusReason}</span><br></br>
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
          <Stack direction={"row"}>
            <Select defaultValue={"State"} onChange={handleChange}>
              <MenuItem value="State">State</MenuItem>
              <MenuItem value="Idle">Idle</MenuItem>
              <MenuItem value="Unlocked">Unlocked</MenuItem>
              <MenuItem value="AlwaysOn">Always On</MenuItem>
              <MenuItem value="Lockout">Lockout</MenuItem>
              <MenuItem value="Fault">Fault</MenuItem>
              <MenuItem value="Startup">Startup</MenuItem>
              <MenuItem value="Restart">Restart</MenuItem>
            </Select>
            <Box>
              <Stack direction={"column"} spacing={0.5} color={"secondary"} mt={1}>
                <Typography variant="body2"><b>BEVer:</b> {BEVer ?? "NULL"}</Typography>
                <Typography variant="body2"><b>FEVer:</b> {FEVer ?? "NULL"}</Typography>
                <Typography variant="body2"><b>HWVer:</b> {HWVer ?? "NULL"}</Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </RequestWrapper>
  );
}
