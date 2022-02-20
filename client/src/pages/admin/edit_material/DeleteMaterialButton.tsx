import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";

const CONFIRM_PROMPT =
  "Are you sure you want to delete this material? This cannot be undone.";

interface DeleteMaterialButtonProps {}

export default function DeleteMaterialButton({}: DeleteMaterialButtonProps) {
  const handleClick = () => {
    if (!window.confirm(CONFIRM_PROMPT)) return;
  };
  return (
    <Button
      variant="outlined"
      startIcon={<DeleteOutlineIcon />}
      color="error"
      onClick={handleClick}
    >
      Delete
    </Button>
  );
}
