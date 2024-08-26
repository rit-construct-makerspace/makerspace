import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Button, Stack, Typography } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_ROOMS from "../../../queries/getRooms";
import RequestWrapper from "../../../common/RequestWrapper";
import Room from "../../../types/Room";
import ZoneHourOptions from "./ZoneHourOptions";

const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!) {
    addRoom(room: { name: $name }) {
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

  const [searchText, setSearchText] = useState("");

  return (
    <RequestWrapper
      loading={getRoomsResult.loading}
      error={getRoomsResult.error}
    >
      <Page title="Rooms" maxWidth="1250px">
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
          Open Hours
        </Typography>
        Hours Editing has been temportarily disabled for database revisions.
      </Page>
    </RequestWrapper>
  );
}
