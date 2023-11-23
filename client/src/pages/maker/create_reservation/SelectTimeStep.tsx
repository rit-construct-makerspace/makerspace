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
import {useLocation} from "react-router-dom";

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

    const MACHINE_REQUIRED_RESERVATION_LENGTH_IN_MS = 1800000 // (30 min in ms)


    const [selectedSlot, setSelectedSlot] = useState<TimeSlot>({startTime: '', endTime: ''})


    const [splitSlots, setSplitSlots] = useState(() => {
        const formatter = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        return chosenExpert.availability.flatMap((slot) => {
            const startTime = +slot.startTime;
            const endTime = +slot.endTime;
            const segmentCount = Math.ceil((endTime - startTime) / MACHINE_REQUIRED_RESERVATION_LENGTH_IN_MS);

            return Array.from({ length: segmentCount }, (_, index) => {
                const segmentStart = startTime + index * MACHINE_REQUIRED_RESERVATION_LENGTH_IN_MS;
                const segmentEnd = Math.min(segmentStart + MACHINE_REQUIRED_RESERVATION_LENGTH_IN_MS, endTime);

                return {
                    startTime: formatter.format(new Date(segmentStart)),
                    endTime: formatter.format(new Date(segmentEnd)),
                };
            });
        }).sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
        });
    });

    const {search} = useLocation();

    const handleSelectSlot = async(e: SelectChangeEvent<string>) => {
        let startTime = e.target.value
        let temp = splitSlots.find(slot => slot.startTime === startTime) as TimeSlot
        const dd = new URLSearchParams(search).get("date") ?? "INVALID DATE"
        const ISOStart = new Date(dd + "T" + temp.startTime + ":00Z").toISOString().replace(/\.\d{3}/, '')
        const ISOEnd = new Date(dd + "T" + temp.endTime + ":00Z").toISOString().replace(/\.\d{3}/, '')
        console.log({startTime: ISOStart, endTime: ISOEnd})
        setSelectedSlot({startTime: ISOStart, endTime: ISOEnd})
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
        <TimeLabelStrip marginTop={-4} />
        <Paper
          elevation={2}
          sx={{
            height: "fit-content",
            width: "5vh",
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
          <FormControl sx={{ width: {xs:"150px",sm:"300px"} }}>
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
