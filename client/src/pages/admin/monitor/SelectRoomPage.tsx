import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import RoomCard from "./RoomCard";
import { Stack } from "@mui/material";

const MockRooms = [
  {
    id: "room1",
    name: "Wood Shop",
    image:
      "https://cdn.vox-cdn.com/thumbor/Q8O7fccxbKBsHyhd4bfeVq5rtyE=/0x432:3809x2426/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/19639216/Workshop_0919-HS-40Something_Ask-studio_TommyCorner-1.0.jpg",
    monitor: {
      name: "Adam Savage",
      avatarHref:
        "https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg",
      id: "test-id-1",
    },
  },
  {
    id: "room2",
    name: "Metal Shop",
    image: "https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg",
    monitor: undefined,
  },
  {
    id: "room3",
    name: "3D Printing Center",
    image:
      "https://content.instructables.com/ORIG/FZ7/FCF2/JRQOT0DN/FZ7FCF2JRQOT0DN.jpg",
    monitor: {
      name: "Jamie Mythbuster Hyneman",
      avatarHref:
        "https://pbs.twimg.com/profile_images/877872917995859971/0iN84zuy.jpg",
      id: "test-id-2",
    },
  },
];

interface SelectRoomPageProps {}

export default function SelectRoomPage({}: SelectRoomPageProps) {
  return (
    <Page title="Select a room to monitor">
      <SearchBar placeholder="Search rooms" sx={{ mb: 4 }} />
      <Stack direction="row" flexWrap="wrap">
        {MockRooms.map((room) => (
          <RoomCard key={room.id} room={room} monitor={room.monitor} />
        ))}
      </Stack>
    </Page>
  );
}
