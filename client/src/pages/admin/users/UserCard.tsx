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
import { useHistory } from "react-router-dom";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const history = useHistory();

  return (
    <Card elevation={2} sx={{ mr: 2, mb: 2 }}>
      <CardActionArea
        sx={{ p: 2, height: "100%" }}
        onClick={() => history.push(`/admin/manage-user?user-id=${user.id}`)}
      >
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
