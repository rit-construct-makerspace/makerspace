import React, {ChangeEventHandler, useState} from "react";
import styled from "styled-components";
import {
    Avatar,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Stack,
    Typography,
} from "@mui/material";
import ExpertAvailability from "../../../types/ExpertAvailability";
import AvailabilityStrip from "./AvailabilityStrip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TimeLabelStrip from "./TimeLabelStrip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TimeSlot from "../../../types/TimeSlot";

const StyledDiv = styled.div``;

interface SelectTimeStepProps {
  chosenExpert: ExpertAvailability;
  stepForwards: () => void;
  stepBackwards: () => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
}

export default function SelectTimeStep({
    chosenExpert,
    stepForwards,
    stepBackwards,
    setSelectedTimeSlot
}: SelectTimeStepProps) {

    const MachineRequiredReservationLengthInMs = 1800000 // (30 min in ms)


    const [selectedSlot, setSelectedSlot] = useState<TimeSlot>({startTime: '00:00', endTime: '00:00'})


    const [splitSlots, setSplitSlots] = useState(() => {
        const formatter = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return chosenExpert.availability.flatMap((slot) => {
            const startTime = +slot.startTime;
            const endTime = +slot.endTime;
            const segmentCount = Math.ceil((endTime - startTime) / MachineRequiredReservationLengthInMs);

            return Array.from({ length: segmentCount }, (_, index) => {
                const segmentStart = startTime + index * MachineRequiredReservationLengthInMs;
                const segmentEnd = Math.min(segmentStart + MachineRequiredReservationLengthInMs, endTime);

                return {
                    startTime: formatter.format(new Date(segmentStart)),
                    endTime: formatter.format(new Date(segmentEnd)),
                };
            });
        }).sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
        });
    });

    const handleSelectSlot = (e: SelectChangeEvent<string>) => {
        let startTime = e.target.value
        console.log(startTime)
        setSelectedSlot(splitSlots.find(slot => slot.startTime === startTime) as TimeSlot)
    }


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
          <AvailabilityStrip
              availability={chosenExpert.availability}
              selectedTimeSlot={selectedSlot}
          />
        </Paper>

        <Stack spacing={4}>
          <Typography variant="h6" component="div" sx={{ lineHeight: 1 }}>
            Select a time slot:
          </Typography>
          <FormControl sx={{ width: "300px" }}>
            <InputLabel id="start-time-label">Selected Slot</InputLabel>
            <Select
                labelId="start-time-label"
                label="Selected Slot"
                onChange={handleSelectSlot}
                value={selectedSlot.startTime}
                >
              {splitSlots.map((slot: TimeSlot) => {
                return <MenuItem key={slot.startTime} value={slot.startTime}>{slot.startTime + " - " + slot.endTime}</MenuItem>
              })}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
                setSelectedTimeSlot(selectedSlot);
                stepForwards();
            }}
            sx={{ alignSelf: "flex-end" }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </StyledDiv>
  );
}
