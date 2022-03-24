import React from "react";
import { Swipe } from "./MonitorRoomPage";
import { Avatar, Card, CardActionArea, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

interface SwipedUserCardProps {
  swipe: Swipe;
}

export default function SwipedUserCard({ swipe }: SwipedUserCardProps) {
  const history = useHistory();

  const { user } = swipe;

  return (
    <Card sx={{ flexShrink: 0, mr: 2 }}>
      <CardActionArea
        sx={{ p: 2 }}
        onClick={() => history.push(`/admin/people/${user.id}`)}
      >
        <Stack alignItems="center" spacing={1.5}>
          <Avatar
            alt=""
            src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            sx={{ width: 80, height: 80 }}
          />
          <Typography
            variant="body1"
            fontWeight={500}
            width={120}
            textAlign="center"
            lineHeight={1.25}
            flex={1}
          >
            {`${user.firstName} ${user.lastName}`}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
