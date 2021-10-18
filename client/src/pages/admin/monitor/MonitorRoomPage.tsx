import React from "react";
import styled from "styled-components";
import Page from "../../Page";
import { Divider, Stack, Typography } from "@mui/material";
import LogRow, { LogEventType } from "../../../common/LogRow";

const StyledDiv = styled.div``;

interface MonitorRoomPageProps {}

export default function MonitorRoomPage({}: MonitorRoomPageProps) {
  return (
    <Page title="Workshop">
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Equipment
      </Typography>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        History
      </Typography>
      <Stack divider={<Divider flexItem />} spacing={2}>
        <LogRow
          eventType={LogEventType.EXIT_ROOM}
          time="3:23 PM"
          person={{
            name: "Adam Savage",
            avatarHref:
              "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
            id: "test-id-1",
          }}
          description="Exited woodshop"
        />
        <LogRow
          eventType={LogEventType.ENTER_ROOM}
          time="12:45 PM"
          person={{
            name: "Adam Savage",
            avatarHref:
              "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
            id: "test-id-1",
          }}
          description="Entered woodshop"
        />
        <LogRow
          eventType={LogEventType.EXIT_ROOM}
          time="3:23 PM"
          person={{
            name: "Adam Savage",
            avatarHref:
              "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
            id: "test-id-1",
          }}
          description="Exited woodshop"
        />
        <LogRow
          eventType={LogEventType.ENTER_ROOM}
          time="12:45 PM"
          person={{
            name: "Adam Savage",
            avatarHref:
              "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
            id: "test-id-1",
          }}
          description="Entered woodshop"
        />
      </Stack>
    </Page>
  );
}
