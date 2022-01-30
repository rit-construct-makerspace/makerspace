import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography } from "@mui/material";

interface CriterionProps {
  satisfied: boolean;
  label: string;
}

export default function Criterion({ satisfied, label }: CriterionProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      color={satisfied ? "success.dark" : "error.dark"}
    >
      {satisfied ? (
        <CheckIcon fontSize="small" />
      ) : (
        <CloseIcon fontSize="small" />
      )}
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}
