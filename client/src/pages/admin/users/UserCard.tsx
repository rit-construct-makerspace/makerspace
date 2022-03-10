import React from "react";
import { Avatar, Card, CardActionArea, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { PartialUser } from "../../../queries/getUsers";
import PrivilegeChip from "./PrivilegeChip";

interface UserCardProps {
  user: PartialUser;
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
          <Avatar
            alt=""
            src={
              "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            }
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

          <PrivilegeChip privilege={user.privilege} />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
