import React, { useState } from "react";
import Page from "../../Page";
import { Step, StepLabel, Stepper } from "@mui/material";
import ChooseExpertStep from "./ChooseExpertStep";
import SelectTimeStep from "./SelectTimeStep";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AddDetailsStep from "./AddDetailsStep";
import ConfirmationStep from "./ConfirmationStep";

interface TotalDayStripProps {}

function TotalDayStrip({}: TotalDayStripProps) {}

interface CreateReservationPageProps {}

export default function CreateReservationPage({}: CreateReservationPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const [chosenExpert, setChosenExpert] = useState<
    ExpertAvailability | undefined
  >(undefined);

  const stepForwards = () => setActiveStep(activeStep + 1);
  const stepBackwards = () => setActiveStep(activeStep - 1);

  return (
    <Page title="Create a reservation">
      <Stepper activeStep={activeStep} sx={{ mb: 2, width: 900 }}>
        {["Choose an expert", "Select a time", "Add details"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <ChooseExpertStep
          stepForwards={stepForwards}
          onExpertClick={(expert) => {
            setChosenExpert(expert);
            stepForwards();
          }}
        />
      )}

      {activeStep === 1 && chosenExpert && (
        <SelectTimeStep
          stepForwards={stepForwards}
          stepBackwards={stepBackwards}
          chosenExpert={chosenExpert}
        />
      )}

      {activeStep === 2 && (
        <AddDetailsStep
          stepBackwards={stepBackwards}
          stepForwards={stepForwards}
        />
      )}

      {activeStep == 3 && <ConfirmationStep />}
    </Page>
  );
}
