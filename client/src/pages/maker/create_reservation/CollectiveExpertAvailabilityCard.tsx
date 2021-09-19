import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import ExpertAvailabilityStrip from "./ExpertAvailabilityStrip";
import CollectiveExpertAvailability from "../../../types/CollectiveExpertAvailability";
import ExpertAvailability from "../../../types/ExpertAvailability";

// cs professors in shambles
const HourLabels = [
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
];

const StyledDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;

  .contents {
    display: flex;
    flex-flow: row nowrap;

    .time-labels {
      padding-top: 60px;
      margin-right: 10px;
      color: ${({ theme }) => theme.palette.text.secondary};

      .time-label {
        height: 40px;
        margin-bottom: 1px;
        text-align: end;
        font-size: 14px;
      }
    }
  }
`;

interface CollectiveExpertAvailabilityCardProps {
  collectiveExpertAvailability: CollectiveExpertAvailability;
  onExpertClick: (expert: ExpertAvailability) => void;
}

export default function CollectiveExpertAvailabilityCard({
  collectiveExpertAvailability,
  onExpertClick,
}: CollectiveExpertAvailabilityCardProps) {
  const { dayOfWeek, dateString, expertAvailabilities } =
    collectiveExpertAvailability;

  return (
    <div>
      <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
        {dayOfWeek}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {dateString}
      </Typography>

      <StyledDiv>
        <div className="contents">
          <div className="time-labels">
            {Array.from(Array(13)).map((_, i) => (
              <div className="time-label" key={i}>
                {HourLabels[i]}
              </div>
            ))}
          </div>

          {expertAvailabilities.map((expertAvailability) => (
            <ExpertAvailabilityStrip
              expertAvailability={expertAvailability}
              onExpertClick={onExpertClick}
              key={expertAvailability.expert.id}
            />
          ))}
        </div>
      </StyledDiv>
    </div>
  );
}
