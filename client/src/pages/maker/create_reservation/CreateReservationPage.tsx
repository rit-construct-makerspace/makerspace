import React, { useState } from "react";
import Page from "../../Page";
import { Step, StepLabel, Stepper } from "@mui/material";
import ChooseExpertStep from "./ChooseExpertStep";
import SelectTimeStep from "./SelectTimeStep";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AddDetailsStep from "./AddDetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import TimeSlot from "../../../types/TimeSlot";
import {useMutation} from "@apollo/client";
import {CREATE_RESERVATION} from "../../../queries/reservationQueries";
import {useParams} from "react-router-dom";
import {useCurrentUser} from "../../../common/CurrentUserProvider";

export default function CreateReservationPage() {
  const { id } = useParams<{ id: string }>();
  const [MachineID] = useState(id)
  const [activeStep, setActiveStep] = useState(0);

  const [selectedExpert, setSelectedExpert] = useState<ExpertAvailability>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({startTime: '', endTime: ''})
  const [message, setMessage] = useState('')

  const [createExpertReservation, { data, loading, error }] = useMutation(CREATE_RESERVATION)

  const stepForwards = () => setActiveStep(activeStep + 1);
  const stepBackwards = () => setActiveStep(activeStep - 1);

  // const [ReservationInput, SetReservationInput] = useState<ReservationInput>()
  const currentUser = useCurrentUser();

  const handleSave = async () => {
    await setSelectedTimeSlot(
        {
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime
        }
    )
    await createExpertReservation({variables:{
      makerID: currentUser.id,
      expertID: selectedExpert?.expert.id,
      equipmentID: MachineID,
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
