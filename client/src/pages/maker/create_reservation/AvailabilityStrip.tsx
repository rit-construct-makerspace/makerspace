import React from "react";
import styled from "styled-components";
import TimeSlot from "../../../types/TimeSlot";

const StyledDiv = styled.div``;

interface AvailabilityStripProps {
  availability: TimeSlot[];
}

export default function AvailabilityStrip({}: AvailabilityStripProps) {
  return <StyledDiv />;
}
