import React, { useState } from "react";
import Page from "../../Page";
import {
  Alert,
  Box,
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
import { gql, useMutation, useQuery } from "@apollo/client";
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
import RequestWrapper from "../../../common/RequestWrapper";
import EditableEquipmentCard from "../manage_equipment/EditableEquipmentCard";
import Equipment from "../../../types/Equipment";
import { DELETE_ROOM } from "../../../queries/roomQueries";
import DeleteIcon from '@mui/icons-material/Delete';
import { useCurrentUser } from "../../../common/CurrentUserProvider";

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
        archived
        imageUrl
        sopUrl
        trainingModules {
          id
          name
        }
        numAvailable
        numInUse
        byReservationOnly
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

const url = "/admin/equipment/";

export default function MonitorRoomPage() {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const queryResult = useQuery(GET_ROOM, { variables: { id } });
  const [deleteRoom] = useMutation(DELETE_ROOM);
  const [loadingUser, setLoadingUser] = useState(false);
  const [cardError, setCardError] = useState(false);

  async function handleDeleteRoom() {
    const confirm = window.confirm("Are you sure you want to delete? This cannot be undone.");
    if (confirm) {
      await deleteRoom({
        variables: {id: id}
      })
      navigate("/")
    }
  }

  return (
    <RequestWrapper2
      result={queryResult}
      render={({ room }) => (
        <AdminPage>
          <Box margin="25px">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">{room.name}</Typography>
              {
                user.privilege == "STAFF"
                ? <Button color="error" variant="contained" startIcon={<DeleteIcon/>} onClick={handleDeleteRoom}>
                  Delete Room
                </Button>
                : null
              }
              
            </Stack>

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
          </Box>
        </AdminPage>
      )}
    />
  );
}
