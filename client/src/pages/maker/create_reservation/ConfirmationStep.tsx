import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

interface ConfirmationStepProps {}

export default function ConfirmationStep({}: ConfirmationStepProps) {
  const history = useHistory();

  return (
    <Container maxWidth="sm">
      <Stack direction="column" alignItems="center">
        <CheckIcon sx={{ width: 200, height: 200 }} color="primary" />
        <Typography variant="h4" component="div" mb={2}>
          You're all set!
        </Typography>
        <Typography variant="body1" textAlign="center">
          Your reservation has been submitted
          <br />
          and will be reviewed by your expert.
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => history.push("/maker/equipment")}>
          Back to Equipment
        </Button>
      </Stack>
    </Container>
  );
}
