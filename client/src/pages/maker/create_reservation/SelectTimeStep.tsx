import React from "react";
import styled from "styled-components";
import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AvailabilityStrip from "./AvailabilityStrip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TimeLabelStrip from "./TimeLabelStrip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StyledDiv = styled.div``;

interface SelectTimeStepProps {
  chosenExpert: ExpertAvailability;
  stepForwards: () => void;
  stepBackwards: () => void;
}

export default function SelectTimeStep({
  chosenExpert,
  stepForwards,
  stepBackwards,
}: SelectTimeStepProps) {
  return (
    <StyledDiv>
      <Button onClick={stepBackwards} startIcon={<ArrowBackIcon />}>
        Back
      </Button>

      <Paper sx={{ p: 2, mb: 8, mt: 2, maxWidth: "md" }}>
        <Typography variant="h6" component="div" mb={1}>
          About the expert
        </Typography>
        <Stack direction="row" spacing={2}>
          <Avatar
            src={chosenExpert.expert.avatarHref}
            alt={`${chosenExpert.expert.name}'s avatar`}
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant="body1">{chosenExpert.expert.about}</Typography>
        </Stack>
      </Paper>

      <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
        Wednesday
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        September 27th
      </Typography>

      <Stack direction="row" mt={4}>
        <TimeLabelStrip marginTop={-10} />
        <Paper
          elevation={2}
          sx={{
            height: "fit-content",
            overflow: "hidden",
            mr: 4,
          }}
        >
          <AvailabilityStrip availability={chosenExpert.availability}/>
        </Paper>

        <Stack spacing={4}>
          <FormControl sx={{ width: "300px" }}>
            <InputLabel id="start-time-label">Start time</InputLabel>
            <Select labelId="start-time-label" label="Start time">
              <MenuItem value={"test1"}>test1</MenuItem>
              <MenuItem value={"test2"}>test2</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: "300px" }}>
            <InputLabel id="end-time-label">End time</InputLabel>
            <Select labelId="end-time-label" label="End time">
              <MenuItem value={"test1"}>test1</MenuItem>
              <MenuItem value={"test2"}>test2</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={stepForwards}
            sx={{ alignSelf: "flex-end" }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </StyledDiv>
  );
}
