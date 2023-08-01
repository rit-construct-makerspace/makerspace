import React, { ReactNode } from "react";
import styled from "styled-components";
import {AvailabilitySlot} from "../../../../../server/src/schemas/availabilitySchema";

interface StyledQuarterHourBlockProps {
  available: boolean;
  addGap: boolean;
}

const StyledQuarterHourBlock = styled.div<StyledQuarterHourBlockProps>`
  width: 3.5vw;
  height: .645vw;

  margin-bottom: ${(props) => (props.addGap ? ".1vw" : "0px")};

  &:last-child {
    margin-bottom: 0;
  }
  
  background-color: ${({ available, theme }) =>
    available ? "limegreen" : "gray "};
`;

interface AvailabilityStripProps {
  availability: AvailabilitySlot[];
}

function getTimeIndex(time: string) {
  const [hour, minute] = time.split(":").map((str) => parseInt(str));
  return hour * 4 + minute / 15;
}

export default function AvailabilityStrip({
  availability
}: AvailabilityStripProps) {
  const timeIntervals: boolean[] = [];

  availability.forEach((availabilitySlot) => {
    const startIndex = getTimeIndex(new Date(parseInt(availabilitySlot.startTime)).toTimeString());
    const endIndex = getTimeIndex(new Date(parseInt(availabilitySlot.endTime)).toTimeString());

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
