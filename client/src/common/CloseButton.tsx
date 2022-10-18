import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Button
      sx={{ width: 2, height: 20 }}
      onClick={() => onClick()}
      style={{
        position: 'absolute',
        right: 5,
        top: 20,
        }}
      >
        X
      </Button>
  );
}
