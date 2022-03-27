import React from "react";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import Person from "../../../types/Person";
import { useNavigate } from "react-router-dom";
import Room from "../../../types/Room";

// TODO: Remove this
const ROOM_PLACEHOLDER_IMAGE =
  "https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg";

interface RoomCardProps {
  room: Room;
  monitor: Person | undefined;
}

export default function RoomCard({ room, monitor }: RoomCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 400, mr: 2, mb: 2 }}>
      <CardActionArea onClick={() => navigate(`/admin/rooms/${room.id}`)}>
        <CardMedia
          component="img"
          image={ROOM_PLACEHOLDER_IMAGE}
          sx={{ height: 200 }}
        />
        <CardContent>
          <Typography variant="h6" component="div" mb={1}>
            {room.name}
          </Typography>

          {monitor ? (
            <Stack direction="row">
              <Avatar
                src={monitor.avatarHref}
                alt=""
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              <Typography variant="body1">{monitor.name}</Typography>
            </Stack>
          ) : (
            <Typography variant="body1">
              Nobody is monitoring this room.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
