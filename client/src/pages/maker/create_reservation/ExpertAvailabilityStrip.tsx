import React from "react";
import { Avatar, Card, CardActionArea, Tooltip } from "@mui/material";
import styled from "styled-components";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AvailabilityStrip from "./AvailabilityStrip";

const StyledDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 10px;
`;

interface ExpertAvailabilityStripProps {
  expertAvailability: ExpertAvailability;
  onExpertClick: (expert: ExpertAvailability) => void;
}

export default function ExpertAvailabilityStrip({
  expertAvailability,
  onExpertClick,
}: ExpertAvailabilityStripProps) {
  return (
    <Card elevation={4} sx={{ height: "fit-content", ml: 2 }}>
      <CardActionArea onClick={() => onExpertClick(expertAvailability)}>
        <StyledDiv>
          <Tooltip title={expertAvailability.expert.name} placement="top">
            <Avatar
              alt="Profile picture 1"
              src={expertAvailability.expert.avatarHref}
              sx={{ mb: 2 }}
            />
          </Tooltip>
          <AvailabilityStrip availability={expertAvailability.availability}/>
        </StyledDiv>
      </CardActionArea>
    </Card>
  );
}
