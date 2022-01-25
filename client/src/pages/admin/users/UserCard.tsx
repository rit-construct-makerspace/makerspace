import React from "react";
import {
  Avatar,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import User from "../../../types/User";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card elevation={2} sx={{ mr: 2, mb: 2 }}>
      <CardActionArea sx={{ p: 2, height: "100%" }}>
        <Stack alignItems="center" spacing={1.5} height="100%">
          <Avatar alt="" src={user.image} sx={{ width: 80, height: 80 }} />
          <Typography
            variant="body1"
            fontWeight={500}
            width={120}
            textAlign="center"
            lineHeight={1.25}
            flex={1}
          >
            {user.name}
          </Typography>
          {user.role !== "Maker" && (
            <Chip
              label={user.role}
              variant="outlined"
              size="small"
              color={user.role === "Admin" ? "primary" : "secondary"}
            />
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
