import React, { useState } from "react";
import Page from "../../Page";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Collapse,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import PageSectionHeader from "../../../common/PageSectionHeader";
import EmptyPageSection from "../../../common/EmptyPageSection";
import CardReader from "./CardReader";
import SwipedUserCard from "./SwipedUserCard";
import styled from "styled-components";
import HistoryIcon from "@mui/icons-material/History";
import { GET_ROOM } from "../../../queries/getRooms";

export const StyledRecentSwipes = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow-x: hidden;
  padding: 1px;
  position: relative;

  // 250px is left nav width. Page has 32px padding (x2). 10px for scrollbars
  max-width: calc(100vw - 250px - 64px - 10px);

  &:after {
    content: "";
    background: linear-gradient(270deg, #fafafa 0%, rgba(250, 250, 250, 0) 50%);
    position: absolute;
    pointer-events: none;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

export interface Swipe {
  id: string;
  dateTime: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function MonitorRoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryResult = useQuery(GET_ROOM, { variables: { id } });
  const [loadingUser, setLoadingUser] = useState(false);
  const [cardErrorCount, setCardErrorCount] = useState(0);

  return (
    <RequestWrapper2
      result={queryResult}
      render={({ room }) => (
        <Page title={room.name} maxWidth="1200px">
          <Collapse in={cardErrorCount > 0}>
            <Alert
              severity="error"
              onClose={() => setCardErrorCount(0)}
              sx={{ mb: 2 }}
            >
              <b>Unrecognized card{cardErrorCount > 1 ? " (" + cardErrorCount + ")" : null}.</b> Has this person registered with The
              Construct? Have they entered their university ID correctly?
            </Alert>
          </Collapse>

          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <PageSectionHeader top>Recent Swipes</PageSectionHeader>
            {loadingUser && (
              <CircularProgress size={20} sx={{ mt: "4px !important" }} />
            )}
            <CardReader
              setLoadingUser={setLoadingUser}
              onCardError={() => setCardErrorCount(cardErrorCount + 1)}
            />
          </Stack>

          <StyledRecentSwipes>
            {room.recentSwipes.map((s: Swipe) => (
              <SwipedUserCard key={s.id} swipe={s} />
            ))}
          </StyledRecentSwipes>

          <PageSectionHeader>Reservations</PageSectionHeader>
          <EmptyPageSection label="Coming soon!" />

          <PageSectionHeader>Equipment</PageSectionHeader>
          {room.equipment.length === 0 && (
            <EmptyPageSection label="No equipment found." />
          )}
          <Grid container spacing={2}>
            {room.equipment.map((equipment: any) => (
              <Grid item key={equipment.id}>
                <Card sx={{ width: 250 }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ lineHeight: 1 }}
                    >
                      {equipment.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <PageSectionHeader>Actions</PageSectionHeader>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => navigate(`/admin/history?q=<room:${id}:`)}
            >
              View Logs
            </Button>
          </Stack>
        </Page>
      )}
    />
  );
}
