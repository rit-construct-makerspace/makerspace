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
import RoomZoneAssociation from "./RoomZoneAssociation";
import AdminPage from "../../AdminPage";

const StyledRecentSwipes = styled.div`
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

export const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      name
      zone {
        id
        name
      }
      recentSwipes {
        id
        user {
          id
          firstName
          lastName
        }
      }
      equipment {
        id
        name
      }
    }
  }
`;

export interface Swipe {
  id: string;
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
  const [cardError, setCardError] = useState(false);

  return (
    <RequestWrapper2
      result={queryResult}
      render={({ room }) => (
        <AdminPage title={room.name} maxWidth="1250px">
          <Collapse in={cardError}>
            <Alert
              severity="error"
              onClose={() => setCardError(false)}
              sx={{ mb: 2 }}
            >
              <b>Unrecognized card.</b> Has this person registered with The
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
              onCardError={() => setCardError(true)}
            />
          </Stack>

          <StyledRecentSwipes>
            {room.recentSwipes.map((s: Swipe) => (
              <SwipedUserCard key={s.id} swipe={s} />
            ))}
          </StyledRecentSwipes>

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
          <Stack direction="column" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => navigate(`/admin/history?q=<room:${id}:`)}
            >
              View Logs
            </Button>
            <RoomZoneAssociation zoneID={room.zone?.id} roomID={Number(id)}></RoomZoneAssociation>
          </Stack>
        </AdminPage>
      )}
    />
  );
}
