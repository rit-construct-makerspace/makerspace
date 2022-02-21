import React from "react";
import Log from "../types/Log";
import { CardActionArea, Stack, Typography } from "@mui/material";

interface LogRowProps {
  log: Log;
}

export default function AuditLogRow({ log }: LogRowProps) {
  return (
    <CardActionArea sx={{ py: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        <Typography variant="body1" width={150}>
          {log.time}
        </Typography>

        <Typography variant="body1" width={150}>
          {log.user}
        </Typography>

        <Typography variant="body2" width={150}>
          {log.type}
        </Typography>

        <Typography variant="body2" width={150}>
          {log.description}
        </Typography>
      </Stack>
    </CardActionArea>
  );
}
