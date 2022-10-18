import React from "react";
import { Stack, SxProps, Typography } from "@mui/material";
import { format } from "date-fns";

// "2022-04-12T20:00:00.000Z" => "Tuesday, April 12th"
export function formatPrettyDate(date: string) {
  return format(new Date(date), "cccc, MMMM do");
}

interface PrettyDateProps {
  date: string; // ex: "Tuesday, April 12th"
  sx?: SxProps;
}

export default function PrettyDate({ date, sx }: PrettyDateProps) {
  return (
    <Stack direction="row" sx={sx}>
      <Typography fontWeight={500} fontSize={20}>
        {date.split(", ")[0]}
      </Typography>
      <Typography fontSize={20}>, {date.split(",")[1]}</Typography>
    </Stack>
  );
}
