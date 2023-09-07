import React, { ReactNode } from "react";
import styled from "styled-components";
import TimeSlot from "../../../types/TimeSlot";

interface StyledQuarterHourBlockProps {
  available: boolean;
  addGap: boolean;
  highlighted?: boolean;
}

const StyledQuarterHourBlock = styled.div<StyledQuarterHourBlockProps>`
  width: 3.5vw;
  height: .645vw;

  margin-bottom: ${(props) => (props.addGap ? ".1vw" : "0px")};

  &:last-child {
    margin-bottom: 0;
  }

  background-color: ${({ available, highlighted, theme }) =>
    highlighted
      ? "yellow"
      : available
      ? "limegreen"
      : "gray"};
`;

interface AvailabilityStripProps {
  availability: TimeSlot[];
  selectedTimeSlot?: TimeSlot;
}

function getTimeIndex(time: string) {
  const [hour, minute] = time.split(":").map((str) => parseInt(str));
  return hour * 4 + minute / 15;
}

export default function AvailabilityStrip({
  availability,
  selectedTimeSlot
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
            highlighted={selectedTimeSlot? (getTimeIndex(selectedTimeSlot.startTime) <= i && getTimeIndex(selectedTimeSlot.endTime) > i): false}
            key={`quarter-hour-block-${i}`}
        />
    );
  }

  return <div>{quarterHourBlocks}</div>;
}
