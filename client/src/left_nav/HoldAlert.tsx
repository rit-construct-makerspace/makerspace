import React from "react";
import { Alert } from "@mui/material";

export default function HoldAlert() {
  return (
    <Alert severity="error" sx={{ my: 2, borderRadius: 0 }}>
      A hold has been placed on your account. You won't be able to create
      reservations, use machines, or purchase materials.
      <br />
      <br />
      Please come into the lab.
    </Alert>
  );
}
