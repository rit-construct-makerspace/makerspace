import React from "react";
import { Typography } from "@mui/material";

interface InfoBlobProps {
  label: string;
  value: string;
}

export default function InfoBlob({ label, value }: InfoBlobProps) {
  return (
    <div>
      <Typography fontWeight={500}>{label}</Typography>
      <Typography>{value}</Typography>
    </div>
  );
}
