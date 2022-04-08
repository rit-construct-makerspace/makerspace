import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import styled from "styled-components";
import { Timeslot } from "./CreateReservationPage";

const StyledTimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 4px;
  row-gap: 4px;
`;

function groupTimeslots(timeslots: Timeslot[]) {
  const groupedTimeslots: { [date: string]: Timeslot[] } = {};

  timeslots.forEach((ts) => {
    const formatted = format(new Date(ts.time), "cccc, LLL do");

    formatted in groupedTimeslots
      ? groupedTimeslots[formatted].push(ts)
      : (groupedTimeslots[formatted] = [ts]);
  });

  return groupedTimeslots;
}

interface SelectStartStepProps {
  timeslots: Timeslot[];
}

export default function SelectStartStep({ timeslots }: SelectStartStepProps) {
  const groupedTimeslots = groupTimeslots(timeslots);

  return (
    <Stack spacing={8} mt={8}>
      {Object.entries(groupedTimeslots).map(([date, timeslots]) => (
        <Stack key={date}>
          <Stack direction="row" mb={2}>
            <Typography fontWeight={500} fontSize={20}>
              {date.split(", ")[0]}
            </Typography>
            <Typography fontSize={20}>, {date.split(",")[1]}</Typography>
          </Stack>
          <StyledTimeGrid>
            {timeslots.map((ts) => (
              <Button key={ts.time} variant="outlined" disabled={!ts.available}>
                {format(new Date(ts.time), "h:mm aaa")}
              </Button>
            ))}
          </StyledTimeGrid>
        </Stack>
      ))}
    </Stack>
  );
}
