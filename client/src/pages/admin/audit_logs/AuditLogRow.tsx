import React from "react";
import { Stack, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import reactStringReplace from "react-string-replace";
import AuditLogEntity from "./AuditLogEntity";

interface AuditLogRowProps {
  dateTime: string;
  message: string;
}

function formatDateTime(dateTime: string) {
  return format(parseISO(dateTime), "M/d/yy h:mmaaa").split(" ");
}

export default function AuditLogRow({ dateTime, message }: AuditLogRowProps) {
  const [date, time] = formatDateTime(dateTime);

  return (
    <Stack direction="row" alignItems="center" px={2}>
      <Typography color="grey.700" sx={{ width: 70 }} variant="body2">
        {date}
      </Typography>
      <Typography color="grey.700" sx={{ width: 93 }} variant="body2">
        {time}
      </Typography>
      <Typography>
        {reactStringReplace(message, /<(\w+?:\d+?:.*?)>/g, (match, i) => (
          <AuditLogEntity key={match + i} entityCode={match} />
        ))}
      </Typography>
    </Stack>
  );
}
