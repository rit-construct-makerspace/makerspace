import React from "react";
import styled from "styled-components";
import Page from "../../Page";
import { Button } from "@mui/material";

const StyledDiv = styled.div``;

interface MonitorRoomPageProps {}

export default function MonitorRoomPage({}: MonitorRoomPageProps) {
  return (
    <Page title="Workshop">
      <Button variant="contained">Begin monitoring</Button>
    </Page>
  );
}
