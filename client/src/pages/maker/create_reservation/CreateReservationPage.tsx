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
import {useMutation} from "@apollo/client";
import {CREATE_RESERVATION} from "../../../queries/reservationQueries";
import {useLocation} from "react-router-dom";

export default function CreateReservationPage() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedMachine, setSelectedMachine] = useState('')
  const [selectedExpert, setSelectedExpert] = useState<ExpertAvailability>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({startTime: '', endTime: ''})
  const [message, setMessage] = useState('')

  const [createExpertReservation, { data, loading, error }] = useMutation(CREATE_RESERVATION)

  const stepForwards = () => setActiveStep(activeStep + 1);
  const stepBackwards = () => setActiveStep(activeStep - 1);

  const [ReservationInput, SetReservationInput] = useState<ReservationInput>()

  const {search} = useLocation();
  const handleSave = async () => {

    await setSelectedTimeSlot(
        {
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime
        }
    )
    await createExpertReservation({variables:{
      makerID: 1,
      expertID: 1,
      equipmentID: 1,
      startTime:  selectedTimeSlot?.startTime,
      endTime: selectedTimeSlot?.endTime,
      startingMakerComment: message
    }})
    stepForwards()
  }

  return (
    <Page title="Create a reservation">
      <Stepper activeStep={activeStep} sx={{ mb:{xs: 1, sm: 2}, width: {xs:'100%', sm:900}}}>
        {["Choose an expert", "Select a time", "Add details"].map((label) => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '.6rem' }}}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/*{activeStep === 0 && (*/}
      {/*    <SelectMachineStep*/}
      {/*        stepForwards={stepForwards}*/}
      {/*    />*/}
      {/*)}*/}

      {activeStep === 0 && (
        <ChooseExpertStep
          stepForwards={stepForwards}
          onExpertClick={(expert) => {
            setSelectedExpert(expert);
            stepForwards();
          }}
        />
      )}

      {activeStep === 1 && selectedExpert && (
        <SelectTimeStep
          stepForwards={stepForwards}
          stepBackwards={stepBackwards}
          chosenExpert={selectedExpert}
          setSelectedTimeSlot={setSelectedTimeSlot}
        />
      )}

      {activeStep === 2 && (
        <AddDetailsStep
          setMessage={setMessage}
          stepBackwards={stepBackwards}
          stepForwards={handleSave}
        />
      )}

      {activeStep === 3 && (
          <ConfirmationStep
              postLoading={loading}
          />
      )}
    </Page>
  );
}
