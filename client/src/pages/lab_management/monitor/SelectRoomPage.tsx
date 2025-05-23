import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Box, Button, Stack, Typography } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_ROOMS from "../../../queries/roomQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Room from "../../../types/Room";
import ZoneHourOptions from "./ZoneHourOptions";
import ZoneCard from "./ZoneCard";
import { GET_ZONES, UPDATE_ZONE } from "../../../queries/zoneQueries";
import AdminPage from "../../AdminPage";

const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!) {
    addRoom(room: { name: $name }) {
      id
    }
  }
`;

const CREATE_ZONE = gql`
  mutation CreateZone($name: String!) {
    addZone(name: $name) {
      id
    }
  }
`;

export default function SelectRoomPage() {
  const getRoomsResult = useQuery(GET_ROOMS);
  const [createRoom] = useMutation(CREATE_ROOM);

  const handleCreateRoom = () => {
    const name = window.prompt("Enter room name:");
    createRoom({
      variables: { name },
      refetchQueries: [{ query: GET_ROOMS }],
    });
  };

  const getZonesResult = useQuery(GET_ZONES);
  const [createZone] = useMutation(CREATE_ZONE);
  const [updateZone] = useMutation(UPDATE_ZONE);

  const handleCreateZone = () => {
    const name = window.prompt("Enter zone name:");
    createZone({
      variables: { name },
      refetchQueries: [{ query: GET_ZONES }],
    });
  };

  const [searchText, setSearchText] = useState("");

  return (
    <RequestWrapper
      loading={getRoomsResult.loading}
      error={getRoomsResult.error}
    >
      <AdminPage>
        <Box margin="25px">
        <Typography
          variant="h4"
          component="div"
          sx={{ lineHeight: 1, m: 2 }}
        >
          Rooms
        </Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <Button variant="contained" onClick={handleCreateRoom}>
            + Add Room
          </Button>
        </Stack>
        <Stack direction="column" flexWrap="nowrap">
          {getRoomsResult.data?.rooms
            .map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </Stack>

        <Typography
          variant="h4"
          component="div"
          sx={{ lineHeight: 1, m: 2 }}
        >
          Zones
        </Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <Button variant="contained" onClick={handleCreateZone}>
            + Add Zone
          </Button>
        </Stack>
        <Stack direction="column" flexWrap="nowrap">
          {getZonesResult.data?.zones
            .map((zone: {id: number, name: string}) => (
            <ZoneCard key={zone.id} id={zone.id} name={zone.name} />
          ))}
        </Stack>
        </Box>
      </AdminPage>
    </RequestWrapper>
  );
}
