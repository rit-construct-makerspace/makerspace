import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import ExpertAvailabilityStrip from "./ExpertAvailabilityStrip";
import CollectiveExpertAvailability from "../../../types/CollectiveExpertAvailability";
import ExpertAvailability from "../../../types/ExpertAvailability";
import TimeLabelStrip from "./TimeLabelStrip";

const StyledDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;

  .contents {
    display: flex;
    flex-flow: row nowrap;
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
    console.log(collectiveExpertAvailability)
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
          <TimeLabelStrip marginTop={56} />
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
