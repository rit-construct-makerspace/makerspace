import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../../Page";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import {
  Avatar,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import StartTimeStep from "./steps/StartTimeStep";
import EndTimeStep from "./steps/EndTimeStep";
import FilesAndNotesStep from "./steps/FilesAndNotesStep";
import ConfirmStep from "./steps/ConfirmStep";

export interface Timeslot {
  time: string;
  available: string;
}

const GET_EQUIPMENT_AND_TIMESLOTS = gql`
  query GetEquipmentAndTimeslots($equipmentID: ID!) {
    equipment(id: $equipmentID) {
      name
      room {
        name
      }
      timeslots {
        time
        available
      }
    }
  }
`;

export default function CreateReservationPage() {
  const { id } = useParams();
  const result = useQuery(GET_EQUIPMENT_AND_TIMESLOTS, {
    variables: { equipmentID: id },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comment, setComment] = useState("");

  const handleStartTimeClicked = (time: string) => {
    setStartTime(time);
    setActiveStep(1);
  };

  const handleEndTimeClicked = (time: string) => {
    setEndTime(time);
    setActiveStep(2);
  };

  const handleBackClicked = () => setActiveStep(activeStep - 1);

  return (
    <RequestWrapper2
      result={result}
      render={({ equipment }) => {
        return (
          <Page title="Create a reservation" maxWidth="600px">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{ width: 60, height: 60 }}
                src="https://ae01.alicdn.com/kf/Hc43d9bc0340547709698a3900a1566f69/ROBOTEC-1325-Cnc-Router-Auction-3D-Cnc-Wood-Carving-Machine-Cnc-Milling-Machine-Design-For-Wood.jpg_Q90.jpg_.webp"
              />
              <Stack>
                <Typography variant="h6">{equipment.name}</Typography>
                <Typography>{equipment.room.name}</Typography>
              </Stack>
            </Stack>

            <Stepper activeStep={activeStep} sx={{ my: 8 }}>
              {["Start time", "End time", "Files & notes", "Confirm"].map(
                (label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => setActiveStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                )
              )}
            </Stepper>

            {activeStep === 0 && (
              <StartTimeStep
                timeslots={equipment.timeslots}
                onStartTimeClicked={handleStartTimeClicked}
              />
            )}

            {activeStep === 1 && (
              <EndTimeStep
                timeslots={equipment.timeslots}
                startTime={startTime}
                onEndTimeClicked={handleEndTimeClicked}
                onBackClicked={handleBackClicked}
              />
            )}

            {activeStep === 2 && (
              <FilesAndNotesStep
                comment={comment}
                setComment={setComment}
                onBackClicked={handleBackClicked}
                onNextClicked={() => setActiveStep(3)}
              />
            )}

            {activeStep === 3 && (
              <ConfirmStep
                startTime={startTime}
                endTime={endTime}
                comment={comment}
                onBackClicked={handleBackClicked}
              />
            )}
          </Page>
        );
      }}
    />
  );
}
