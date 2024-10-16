import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Room from "../../../types/Room";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 800, mr: 2, mb: 2 }}>
      <CardActionArea onClick={() => navigate(`/admin/rooms/${room.id}`)}>
        <CardContent>
          <Stack direction={"row"} spacing={2} sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Typography variant="h6" component="div">
              {room.name}
            </Typography>
            <Typography variant="body2" component="div">
              {"ID " + room.id}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
