import React from "react";
import styled from "styled-components";
import { Button, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert } from "@mui/lab";

const StyledDiv = styled.div``;

interface AddDetailsStepProps {
  stepBackwards: () => void;
  stepForwards: () => void;
}

export default function AddDetailsStep({
  stepBackwards,
  stepForwards,
}: AddDetailsStepProps) {
  return (
    <Stack direction="column" alignItems="flex-start" spacing={4}>
      <Button onClick={stepBackwards} startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      <Typography variant="body1">
        Help our experts help you by including any necessary details, machining
        files, etc.
      </Typography>
      <TextField
        id="message-box"
        label="Add a message"
        multiline
        rows={4}
        sx={{ alignSelf: "stretch" }}
      />
      <Alert severity="info" sx={{ alignSelf: "center" }}>
        File drop & upload coming soon!
      </Alert>
      <Button
        variant="contained"
        sx={{ alignSelf: "flex-end" }}
        onClick={stepForwards}
      >
        Create reservation
      </Button>
    </Stack>
  );
}
