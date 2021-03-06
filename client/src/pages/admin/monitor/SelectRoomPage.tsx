import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Button, Stack } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_ROOMS from "../../../queries/getRooms";
import RequestWrapper from "../../../common/RequestWrapper";
import Room from "../../../types/Room";

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

  return (
    <RequestWrapper
      loading={getRoomsResult.loading}
      error={getRoomsResult.error}
    >
      <Page title="Rooms">
        <Stack direction="row" spacing={2} mb={4}>
          <SearchBar placeholder="Search rooms" />
          <Button variant="contained" onClick={handleCreateRoom}>
            + Add Room
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap">
          {getRoomsResult.data?.rooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
