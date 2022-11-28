import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Room from "../../../types/Room";

// TODO: Remove this
const ROOM_PLACEHOLDER_IMAGE =
  "https://i.ytimg.com/vi/nfDgGOCy4ms/maxresdefault.jpg";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
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
          <Typography variant="h6" component="div">
            {room.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
