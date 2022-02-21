import React, { ReactNode } from "react";
import styled from "styled-components";
import TimeSlot from "../../../types/TimeSlot";

interface StyledQuarterHourBlockProps {
  available: boolean;
  addGap: boolean;
}

const StyledQuarterHourBlock = styled.div<StyledQuarterHourBlockProps>`
  width: 60px;
  height: 10px;

  margin-bottom: ${(props) => (props.addGap ? "1px" : "0px")};

  &:last-child {
    margin-bottom: 0;
  }

  background-color: ${({ available, theme }) =>
    available ? theme.palette.primary.light : theme.palette.grey["200"]};
`;

interface AvailabilityStripProps {
  availability: TimeSlot[];
}

function getTimeIndex(time: string) {
  const [hour, minute] = time.split(":").map((str) => parseInt(str));
  return hour * 4 + minute / 15;
}

export default function AvailabilityStrip({
  availability,
}: AvailabilityStripProps) {
  const timeIntervals: boolean[] = [];

  availability.forEach((timeSlot) => {
    const startIndex = getTimeIndex(timeSlot.startTime);
    const endIndex = getTimeIndex(timeSlot.endTime);

    for (let i = startIndex; i < endIndex; i++) {
      timeIntervals[i] = true;
    }
  });

  const quarterHourBlocks: ReactNode[] = [];

  for (let i = getTimeIndex("09:00"); i < getTimeIndex("21:00"); i++) {
    quarterHourBlocks.push(
      <StyledQuarterHourBlock
        available={timeIntervals[i]}
        addGap={(i + 1) % 4 === 0}
        key={`quarter-hour-block-${i}`}
      />
    );
  }

  return <div>{quarterHourBlocks}</div>;
}
