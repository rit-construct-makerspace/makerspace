import React, { ReactNode } from "react";
import PrettyModal from "../../../common/PrettyModal";
import { Button, Divider, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function StepNumber({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h1"
      component="div"
      sx={{
        color: "primary.main",
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  return (
    <PrettyModal open={open} onClose={onClose}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <StepNumber>1</StepNumber>
          <Stack spacing={1}>
            <Typography variant="body1">
              Complete transaction on
              <br />
              Tiger Bucks Transaction Portal.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              href="https://www.google.com"
              target="_blank"
            >
              Open portal
            </Button>
          </Stack>
        </Stack>

        <Divider flexItem />

        <Stack direction="row" spacing={4} alignItems="center">
          <StepNumber>2</StepNumber>
          <Stack spacing={1}>
            <Typography variant="body1">Update Construct inventory.</Typography>
            <Button variant="outlined" startIcon={<OpenInNewIcon />}>
              Open portal
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </PrettyModal>
  );
}
