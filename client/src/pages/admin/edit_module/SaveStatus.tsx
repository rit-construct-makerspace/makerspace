import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { CircularProgress, Stack, Typography } from "@mui/material";

interface SaveStatusProps {
  loading: boolean;
}

export default function SaveStatus({ loading }: SaveStatusProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ height: 24, mt: 2 }}
    >
      {loading ? <CircularProgress size={20} /> : <CheckIcon color="success" />}
      <Typography variant="body2">{loading ? "Saving..." : "Saved"}</Typography>
    </Stack>
  );
}
