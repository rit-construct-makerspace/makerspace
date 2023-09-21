import React, { useState } from "react";
import Page from "../../Page";
import { Step, StepLabel, Stepper } from "@mui/material";
import ChooseExpertStep from "./ChooseExpertStep";
import SelectTimeStep from "./SelectTimeStep";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AddDetailsStep from "./AddDetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import ReservationInput from "../../../types/Reservation"
import TimeSlot from "../../../types/TimeSlot";
import SelectMachineStep from "./SelectMachineStep";

export default function CreateReservationPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedExpert, setSelectedExpert] = useState<ExpertAvailability>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>()

  const stepForwards = () => setActiveStep(activeStep + 1);
  const stepBackwards = () => setActiveStep(activeStep - 1);

  const [ReservationInput, SetReservationInput] = useState<ReservationInput>()

  return (
    <Page title="Create a reservation">
      <Stepper activeStep={activeStep} sx={{ mb: 2, width: 900 }}>
        {["Select a Machine", "Choose an expert", "Select a time", "Add details"].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
          <SelectMachineStep
              stepForwards={stepForwards}
          />
      )}

      {activeStep === 1 && (
        <ChooseExpertStep
          stepForwards={stepForwards}
          onExpertClick={(expert) => {
            setSelectedExpert(expert);
            stepForwards();
          }}
        />
      )}

      {activeStep === 2 && selectedExpert && (
        <SelectTimeStep
          stepForwards={stepForwards}
          stepBackwards={stepBackwards}
          chosenExpert={selectedExpert}
          setSelectedTimeSlot={() => setSelectedTimeSlot}
        />
      )}

      {activeStep === 3 && (
        <AddDetailsStep
          stepBackwards={stepBackwards}
          stepForwards={stepForwards}
        />
      )}

      {activeStep === 4 && <ConfirmationStep />}
    </Page>
  );
}
