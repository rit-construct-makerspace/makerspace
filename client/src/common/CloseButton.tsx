import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={onClick}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  );
}
