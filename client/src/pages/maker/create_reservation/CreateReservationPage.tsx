import React from "react";
import styled from "styled-components";
import Page from "../../Page";
import {
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import ExpertAvailabilityStrip from "./ExpertAvailabilityStrip";

const StyledTotalDayStrip = styled.div`
  display: flex;
  flex-flow: column nowrap;

  .contents {
    display: flex;
    flex-flow: row nowrap;

    .time-labels {
      padding-top: 60px;
      margin-right: 10px;

      .time-label {
        height: 40px;
        margin-bottom: 1px;
        text-align: end;
        font-size: 14px;
      }
    }
  }
`;

interface TotalDayStripProps {}

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

function TotalDayStrip({}: TotalDayStripProps) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
        Monday
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        September 27th
      </Typography>
      <StyledTotalDayStrip>
        <div className="contents">
          <div className="time-labels">
            {Array.from(Array(13)).map((_, i) => (
              <div className="time-label">{HourLabels[i]}</div>
            ))}
          </div>

          <ExpertAvailabilityStrip
            expertName="Adam Savage"
            avatarHref="https://speaking.com/wp-content/uploads/2017/06/Adam-Savage.jpg"
            availability={[
              {
                startTime: "10:15",
                endTime: "13:30",
              },
              {
                startTime: "16:45",
                endTime: "19:00",
              },
            ]}
          />
          <ExpertAvailabilityStrip
            expertName="Jamie Hyneman"
            avatarHref="https://pbs.twimg.com/profile_images/877872917995859971/0iN84zuy.jpg"
            availability={[
              {
                startTime: "09:00",
                endTime: "17:00",
              },
            ]}
          />
          <ExpertAvailabilityStrip
            expertName="Grant Imahara"
            avatarHref="https://www.mercurynews.com/wp-content/uploads/2020/07/SJM-L-IMAHARA-0716-2.jpg"
            availability={[
              {
                startTime: "11:00",
                endTime: "12:30",
              },
              {
                startTime: "14:00",
                endTime: "16:15",
              },
              {
                startTime: "19:00",
                endTime: "21:00",
              },
            ]}
          />
        </div>
      </StyledTotalDayStrip>
    </Paper>
  );
}

interface CreateReservationPageProps {}

export default function CreateReservationPage({}: CreateReservationPageProps) {
  return (
    <Page title="Create a reservation">
      <Stepper>
        {["Choose an expert", "Select a time", "Add details"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="body1" marginY={2}>
        For your safety, our experts are here to guide you as you use the
        equipment.
      </Typography>
      <Stack direction="row" spacing={2}>
        <TotalDayStrip />
        <TotalDayStrip />
        <TotalDayStrip />
      </Stack>
    </Page>
  );
}
