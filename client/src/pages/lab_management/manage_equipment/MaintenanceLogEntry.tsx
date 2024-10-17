import React, { useEffect, useState } from "react";
import { Chip, IconButton, Stack, SxProps, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import reactStringReplace from "react-string-replace";
import { DELETE_MAINTENANCE_LOG, GET_MAINTENANCE_LOGS, MaintenanceLogItem } from "../../../queries/maintenanceLogQueries";
import AuditLogEntity from "../audit_logs/AuditLogEntity";
import ActionButton from "../../../common/ActionButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Privilege from "../../../types/Privilege";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import { useMutation } from "@apollo/client";


function formatDateTime(dateTime: string) {
  return format(parseISO(dateTime), "M/d/yy h:mmaaa").split(" ");
}

export default function MaintenanceLogEntry({ logItem }: { logItem: MaintenanceLogItem }) {
  const currentUser = useCurrentUser();

  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);
  const isMobile = width <= 1100;

  const [date, time] = formatDateTime(logItem.timestamp);

  const [deleteLog] = useMutation(DELETE_MAINTENANCE_LOG, {variables: {id: logItem.id}, refetchQueries: [{ query: GET_MAINTENANCE_LOGS, variables: {equipmentID: logItem.equipment?.id} }] });

  const handleClick = () => {
    if (!window.confirm("Are you sure you want to delete this log? This cannot be undone.")) return;
    deleteLog();
  };

  return (
    <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} px={2} minHeight={60}>
      <IconButton hidden={currentUser.privilege != Privilege.STAFF} color="error" onClick={handleClick}><DeleteIcon /></IconButton>
      <Stack direction={isMobile ? "row" : "column"}>
        <Typography color={localStorage.getItem("themeMode") == "dark" ? "grey.300" : "grey.700"} sx={{ width: 70 }} variant="body2">
          {date}
        </Typography>
        <Typography color={localStorage.getItem("themeMode") == "dark" ? "grey.300" : "grey.700"} sx={{ width: 93 }} variant="body2">
          {time}
        </Typography>
      </Stack>
      <Typography color={localStorage.getItem("themeMode") == "dark" ? "grey.300" : "grey.700"} sx={{ width: 120 }} variant="body1">
        <AuditLogEntity entityCode={`equipment:${logItem.id}:${logItem.author.firstName} ${logItem.author.lastName}`} />
      </Typography>
      <Typography maxWidth={"60%"}>
        {logItem.content}
      </Typography>
    </Stack>
  );
}
