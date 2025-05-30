import { Card, CardHeader, Divider, Stack, Typography } from "@mui/material";
import AuditLogEntity from "../../audit_logs/AuditLogEntity";
import { secondsToHumanString, VerboseEquipmentSession } from "./EquipmentStats";
import { Box } from "@mui/system";
import { ScatterChart } from '@mui/x-charts/ScatterChart';

type EquipmentStatCardProps = {
  relevantEquipmentSessions: VerboseEquipmentSession[]
}

function formatSecondsToHoursMinutes(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  let result = '';
  if (hours > 0) {
    result += `${hours} hr\n`;
  }
  if (minutes > 0 || hours === 0) {
    result += `${minutes} min`;
  }
  
  return result.trim();
}

function formatDateToTime(date: Date): number {
  var newDate = new Date(date);
  newDate.setFullYear(2020);
  newDate.setMonth(1);
  newDate.setDate(10);
  
  return newDate.getTime() - new Date(2020,1,10,0,0,0,0).getTime();
}


export function EquipmentStatCard({relevantEquipmentSessions}: EquipmentStatCardProps) {
  var sumSessionlength = 0;
  var uniqueUsers: number[] = [];

  relevantEquipmentSessions.forEach((eqSession: VerboseEquipmentSession) => {
    //Add session time to sum
    sumSessionlength += eqSession.sessionLength;
    //Add all unique IDs to array
    if (!uniqueUsers.includes(eqSession.userID)) {
      uniqueUsers.push(eqSession.userID);
    }
  });

  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());


  return (
    <Card sx={{width: 800}}>
      <CardHeader title={relevantEquipmentSessions[0].readerSlug} 
        subheader={<AuditLogEntity entityCode={`equipment:${relevantEquipmentSessions[0].equipmentID}:${relevantEquipmentSessions[0].equipmentName}`} />}
      />

      <Stack direction={"column"}>
        <Box mx={5}>
          <Typography variant="body2" fontSize={"80%"} sx={{opacity: 0.8}}>
            Cummulative Time In Use
          </Typography>
          <Typography variant="h6">
            {secondsToHumanString(sumSessionlength)}
          </Typography>
        </Box>
        <Divider orientation="horizontal" />
        <Box mx={5}>
          <Typography variant="body2" fontSize={"80%"} sx={{opacity: 0.8}}>
            Average Time In Use
          </Typography>
          <Typography variant="h6">
            {secondsToHumanString(Math.round(sumSessionlength / relevantEquipmentSessions.length))}
          </Typography>
        </Box>
      </Stack>

      <Divider orientation="horizontal" />

      <Stack direction={"row"} justifyContent={"space-around"}>
        <Box mx={5}>
          <Typography variant="body2" fontSize={"80%"} sx={{opacity: 0.8}}>
            # of Sessions
          </Typography>
          <Typography variant="h6">
            {relevantEquipmentSessions.length}
          </Typography>
        </Box>
        <Divider orientation="vertical" />
        <Box mx={5}>
          <Typography variant="body2" fontSize={"80%"} sx={{opacity: 0.8}}>
            # of Unique Users
          </Typography>
          <Typography variant="h6">
            {uniqueUsers.length}
          </Typography>
        </Box>
      </Stack>

      <Divider orientation="horizontal" />

      <Box mx={5}>
        <ScatterChart
          height={300}
          series={[
            {
              label: 'Series A',
              data: relevantEquipmentSessions.map((v) => ({ x: formatDateToTime(new Date(v.start)), y: v.sessionLength, id: v.id })),
            },
          ]}
          xAxis={[{min: new Date(2020,1,10,0,0,0,0).getTime(), max: new Date(2020,1,10,23,59,0,0).getTime(), valueFormatter: (v) => (new Date(v).toTimeString().split(" ")[0])}]}
          yAxis={[{max: 18000, valueFormatter: (v) => formatSecondsToHoursMinutes(v)}]}
        />
      </Box>

    </Card>
  );
}