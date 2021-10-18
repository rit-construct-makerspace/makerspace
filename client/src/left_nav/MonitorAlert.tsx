import React from "react";
import styled from "styled-components";
import { Alert } from "@mui/lab";
import { Button, Link, Stack, Typography } from "@mui/material";
import MonitorIcon from "@mui/icons-material/Monitor";

const StyledDiv = styled.div`
  background: ${({ theme }) => theme.palette.primary.light};
  border-radius: 4px;
`;

interface MonitoringBoxProps {}

export default function MonitorAlert({}: MonitoringBoxProps) {
  return (
    <Alert
      severity="info"
      icon={<MonitorIcon />}
      sx={{ mb: 2, borderRadius: 0 }}
    >
      <Stack>
        <Typography variant="body1">
          You are monitoring the{" "}
          <Link href="/admin/monitor/sample-room" sx={{ fontWeight: 500 }}>
            woodshop
          </Link>
        </Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, flexGrow: 1 }}>
            23:45
          </Typography>

          <Button size="small" variant="outlined">
            Stop
          </Button>
        </Stack>
      </Stack>
    </Alert>
  );
}
