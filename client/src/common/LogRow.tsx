import React from "react";
import styled from "styled-components";
import Person from "../types/Person";
import { Avatar, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export enum LogEventType {
  ENTER_ROOM,
  EXIT_ROOM,
}

const LogRowIcon = ({ eventType }: { eventType: LogEventType }) => {
  switch (eventType) {
    case LogEventType.ENTER_ROOM:
      return <LoginIcon />;
    case LogEventType.EXIT_ROOM:
      return <LogoutIcon />;
  }
};

const StyledStack = styled(Stack)`
  .MuiSvgIcon-root {
    margin-right: 32px;
  }
`;

interface LogRowProps {
  eventType: LogEventType;
  time: string;
  person: Person;
  description: string;
}

export default function LogRow({
  eventType,
  time,
  person,
  description,
}: LogRowProps) {
  return (
    <StyledStack direction="row" alignItems="center">
      <LogRowIcon eventType={eventType} />
      <Avatar
        alt=""
        src={person.avatarHref}
        sx={{ width: 24, height: 24, mr: 1 }}
      />
      <Typography variant="body1" sx={{ mr: 8 }}>
        {person.name}
      </Typography>
      <Typography variant="body1" sx={{ mr: 2, flexGrow: 1 }}>
        {description}
      </Typography>
      {time}
    </StyledStack>
  );
}
