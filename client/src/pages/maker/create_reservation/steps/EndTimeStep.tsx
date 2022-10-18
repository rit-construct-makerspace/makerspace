import React from "react";
import { Stack, Typography } from "@mui/material";
import { Timeslot } from "../CreateReservationPage";
import { format, isSameDay } from "date-fns";
import TimeslotButton from "../common/TimeslotButton";
import BackButton from "../common/BackButton";
import StyledTimeGrid from "../common/StyledTimeGrid";
import PrettyDate, { formatPrettyDate } from "../common/PrettyDate";

interface EndTimeStepProps {
  timeslots: Timeslot[];
  startTime: string;
  onEndTimeClicked: (time: string) => void;
  onBackClicked: () => void;
}

export default function EndTimeStep({
  timeslots,
  startTime,
  onEndTimeClicked,
  onBackClicked,
}: EndTimeStepProps) {
  const start = new Date(startTime);

  // End times must be after the start time and of the same day
  let endTimes = timeslots.filter(
    (ts) => ts.time > startTime && isSameDay(start, new Date(ts.time))
  );

  // You can't "leapfrog" an occupied timeslot
  const firstUnavailableIndex = endTimes.findIndex((ts) => !ts.available);
  if (firstUnavailableIndex !== -1)
    endTimes = endTimes.slice(0, firstUnavailableIndex);

  return (
    <Stack>
      <PrettyDate date={formatPrettyDate(startTime)} />

      <Typography color="text.secondary" mb={2}>
        Starting at {format(new Date(startTime), "h:mm aaa")}
      </Typography>

      <StyledTimeGrid>
        {endTimes.map((ts) => (
          <TimeslotButton
            key={ts.time}
            timeslot={ts}
            onClick={onEndTimeClicked}
          />
        ))}
      </StyledTimeGrid>

      <BackButton onClick={onBackClicked} />
    </Stack>
  );
}
