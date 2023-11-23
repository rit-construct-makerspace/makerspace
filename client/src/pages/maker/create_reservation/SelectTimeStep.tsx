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
import {intToDayOfWeek, intToMonth, intToOrdinal} from "./ChooseExpertStep";

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
    const [tempselectedSlot, settempSelectedSlot] = useState<TimeSlot>({startTime: '', endTime: ''})


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
    const d = new URLSearchParams(search).get("date")

    const handleSelectSlot = async(e: SelectChangeEvent<string>) => {
        let temp = splitSlots.find(slot => slot.startTime === e.target.value.split(" - ")[0]) as TimeSlot
        console.log(splitSlots)
        const dd = d ?? "INVALID DATE"
        const ISOStart = new Date(dd + "T" + temp.startTime + ":00Z").toISOString().replace(/\.\d{3}/, '')
        const ISOEnd = new Date(dd + "T" + temp.endTime + ":00Z").toISOString().replace(/\.\d{3}/, '')
        setSelectedSlot({startTime: ISOStart, endTime: ISOEnd})
        settempSelectedSlot({startTime: e.target.value.split(" - ")[0], endTime: e.target.value.split(" - ")[1]})
    }

    function convertTo12Hour(time:string) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
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
            {d!=="" ? intToDayOfWeek(new Date(d + "T00:00:00").getDay()) : ""}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {d!=="" ? intToMonth(new Date(d + "T00:00:00").getMonth()) + " " + intToOrdinal(new Date(d + "T00:00:00").getDate()) : ""}
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
              selectedTimeSlot={tempselectedSlot}
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
                value={tempselectedSlot.startTime ? tempselectedSlot.startTime + " - " + tempselectedSlot.endTime : ''}
                >
              {splitSlots.map((slot: TimeSlot) => {
                return <MenuItem key={slot.startTime + " - " + slot.endTime} value={slot.startTime + " - " + slot.endTime}>{convertTo12Hour(slot.startTime) + " - " + convertTo12Hour(slot.endTime)}</MenuItem>
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
