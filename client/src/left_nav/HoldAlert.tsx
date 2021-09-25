import React from "react";
import { Alert } from "@mui/lab";

export default function HoldAlert() {
  return (
    <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
      An hold has been placed on your account. You won't be able to create
      reservations, use machines, or purchase materials.
      <br />
      <br />
      Please come into the lab.
    </Alert>
  );
}
