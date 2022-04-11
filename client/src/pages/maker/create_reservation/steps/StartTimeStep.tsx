import React from "react";
import { Stack } from "@mui/material";
import { Timeslot } from "../CreateReservationPage";
import TimeslotButton from "../common/TimeslotButton";
import StyledTimeGrid from "../common/StyledTimeGrid";
import PrettyDate, { formatPrettyDate } from "../common/PrettyDate";

function groupTimeslots(timeslots: Timeslot[]) {
  const groupedTimeslots: { [date: string]: Timeslot[] } = {};

  timeslots.forEach((ts) => {
    const formatted = formatPrettyDate(ts.time);

    formatted in groupedTimeslots
      ? groupedTimeslots[formatted].push(ts)
      : (groupedTimeslots[formatted] = [ts]);
  });

  return groupedTimeslots;
}

interface SelectStartStepProps {
  timeslots: Timeslot[];
  onStartTimeClicked: (time: string) => void;
}

export default function StartTimeStep({
  timeslots,
  onStartTimeClicked,
}: SelectStartStepProps) {
  const groupedTimeslots = groupTimeslots(timeslots);

  return (
    <Stack spacing={8}>
      {Object.entries(groupedTimeslots).map(([date, timeslots]) => (
        <Stack key={date}>
          <PrettyDate date={date} sx={{ mb: 2 }} />

          <StyledTimeGrid>
            {timeslots.map((ts) => (
              <TimeslotButton
                key={ts.time}
                timeslot={ts}
                onClick={onStartTimeClicked}
              />
            ))}
          </StyledTimeGrid>
        </Stack>
      ))}
    </Stack>
  );
}
