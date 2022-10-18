import React from "react";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { Timeslot } from "../CreateReservationPage";

// "2022-04-08T19:00:00.000Z" => "3:00 pm"
export function formatPrettyTime(time: string) {
  return format(new Date(time), "h:mm aaa");
}

interface TimeslotButtonProps {
  timeslot: Timeslot;
  onClick: (time: string) => void;
}

export default function TimeslotButton({
  timeslot,
  onClick,
}: TimeslotButtonProps) {
  return (
    <Button
      variant="outlined"
      disabled={!timeslot.available}
      onClick={() => onClick(timeslot.time)}
    >
      {formatPrettyTime(timeslot.time)}
    </Button>
  );
}
