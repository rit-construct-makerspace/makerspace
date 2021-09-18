import React, { ReactNodeArray } from "react";
import { Avatar, Card, CardActionArea, Tooltip } from "@mui/material";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 10px;
`;

interface StyledQuarterHourBlockProps {
  available: boolean;
  addGap: boolean;
}

const StyledQuarterHourBlock = styled.div<StyledQuarterHourBlockProps>`
  width: 60px;
  height: 10px;

  margin-bottom: ${(props) => (props.addGap ? "1px" : "0px")};

  &:first-child {
    margin-top: 20px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  background-color: ${({ available, theme }) =>
    available ? theme.palette.primary.light : theme.palette.grey["200"]};
`;

export interface TimeSlot {
  startTime: string; // ex: "09:15"
  endTime: string; // ex: "16:30"
}

interface ExpertAvailabilityStripProps {
  expertName: string;
  avatarHref: string;
  availability: TimeSlot[];
}

function getTimeIndex(time: string) {
  const [hour, minute] = time.split(":").map((str) => parseInt(str));
  return hour * 4 + minute / 15;
}

export default function ExpertAvailabilityStrip({
  expertName,
  avatarHref,
  availability,
}: ExpertAvailabilityStripProps) {
  const timeIntervals: boolean[] = [];

  availability.forEach((timeSlot) => {
    const startIndex = getTimeIndex(timeSlot.startTime);
    const endIndex = getTimeIndex(timeSlot.endTime);

    for (let i = startIndex; i < endIndex; i++) {
      timeIntervals[i] = true;
    }
  });

  const idk: ReactNodeArray = [];

  console.log(getTimeIndex("09:00"));

  for (let i = getTimeIndex("09:00"); i < getTimeIndex("21:00"); i++) {
    idk.push(
      <StyledQuarterHourBlock
        available={timeIntervals[i]}
        addGap={(i + 1) % 4 === 0}
      />
    );
  }

  return (
    <Card elevation={4} sx={{ height: "fit-content", ml: 1 }}>
      <CardActionArea>
        <StyledDiv>
          <Tooltip title={expertName} placement="top">
            <Avatar alt="Profile picture 1" src={avatarHref} />
          </Tooltip>
          <div>{idk}</div>
        </StyledDiv>
      </CardActionArea>
    </Card>
  );
}
