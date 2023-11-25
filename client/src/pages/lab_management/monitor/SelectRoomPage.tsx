import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Button, Stack } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import GET_ROOMS, { CREATE_ROOM } from "../../../queries/roomQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Room from "../../../types/Room";
import RoomModal from "./RoomModal";


export default function SelectRoomPage() {
  const getRoomsResult = useQuery(GET_ROOMS);

  const [searchText, setSearchText] = useState("");
  const [modalItemId, setModalItemId] = useState<number>(0);

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
          <Button variant="contained" onClick={() => setModalItemId(-1)}>
            + Add Room
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap">
          {getRoomsResult.data?.rooms
            ?.filter((m: { id: number; name: string; pictureURL: string;}) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ).map((room: Room) => (
            <RoomCard key={room.id} room={room} clickable={true} />
          ))}
        </Stack>
        <RoomModal
            roomID={modalItemId}
            onClose={() => setModalItemId(0)}
        />
      </Page>
    </RequestWrapper>
  );
}
