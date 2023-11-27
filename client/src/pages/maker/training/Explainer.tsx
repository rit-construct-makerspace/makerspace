import React from "react";
import { Divider, Paper, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import QuizIcon from "@mui/icons-material/Quiz";
import EventIcon from "@mui/icons-material/Event";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import styled from "styled-components";

const StyledExplainer = styled.div`
  line-height: 1.3em;
  text-align: center; 
  width: 100%;

  .explainer-tagline {
    font-size: 18px;
    font-weight: bold;
    line-height: 2em;
  }

  .explainer-icon {
    font-size: 48px;
    color: rgba(247, 105, 2, 0.84);
    margin-bottom: 8px;
  }
`;

export default function Explainer() {
  return (
    <StyledExplainer>
      <Paper elevation={2} sx={{ px: 4, pb: 4, pt: 3}}>
        <Stack sx={{ textAlign: "left", mb: 4 }}>
          <div className="explainer-tagline">
            Be safe and sure with training at the Construct.
          </div>
          Many of the machines at the Construct carry significant risk of injury
          with improper use.
          <br />
          You must complete all training modules for a given machine before you
          can reserve it.
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          divider={
            <Divider orientation="vertical" flexItem>
              <ArrowForwardIcon sx={{ opacity: 0.5 }} />
            </Divider>
          }
        >
          <Stack alignItems="center">
            <AutoStoriesIcon className="explainer-icon" />
            Watch & read
            <br />
            training materials
          </Stack>
          <Stack alignItems="center">
            <QuizIcon className="explainer-icon" />
            Score an 80%
            <br />
            on the quiz
          </Stack>
          <Stack alignItems="center">
            <EventIcon className="explainer-icon" />
            Create a reservation
          </Stack>
          <Stack alignItems="center">
            <CarpenterIcon className="explainer-icon" />
            Make away!
          </Stack>
        </Stack>
      </Paper>
    </StyledExplainer>
  );
}
