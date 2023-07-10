import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Button, Stack } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import GET_ROOMS, { CREATE_ROOM } from "../../../queries/roomQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Room from "../../../types/Room";


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
          <SearchBar 
            placeholder="Search rooms"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreateRoom}>
            + Add Room
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap">
          {getRoomsResult.data?.rooms
            ?.filter((m: { id: number; name: string }) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ).map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
