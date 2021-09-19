import React from "react";
import styled from "styled-components";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ExpertAvailability from "../../../types/ExpertAvailability";

const StyledDiv = styled.div``;

interface SelectTimeStepProps {
  stepForwards: () => void;
  stepBackwards: () => void;
  chosenExpert: ExpertAvailability;
}

export default function SelectTimeStep({
  stepForwards,
  stepBackwards,
  chosenExpert,
}: SelectTimeStepProps) {
  return (
    <StyledDiv>
      <Button onClick={stepBackwards}>Back</Button>
      <FormControl sx={{ width: "300px" }}>
        <InputLabel id="start-time-label">Start time</InputLabel>
        <Select labelId="start-time-label" label="Start time">
          <MenuItem value={"test1"}>test1</MenuItem>
          <MenuItem value={"test2"}>test2</MenuItem>
        </Select>
      </FormControl>
    </StyledDiv>
  );
}
