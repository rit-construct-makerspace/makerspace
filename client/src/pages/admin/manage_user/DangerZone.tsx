import React from "react";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCurrentUser } from "../../../common/CurrentUserProvider";

interface DangerZoneProps {}

export default function DangerZone({}: DangerZoneProps) {
  const { user } = useCurrentUser();

  if (user.role !== "Admin") {
    return null;
  }

  return (
    <>
      <PageSectionHeader>Danger Zone</PageSectionHeader>
      <Typography variant="body1">This cannot be undone.</Typography>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        sx={{ mt: 1 }}
        onClick={() =>
          window.confirm(
            "Are you sure you wish to delete John Smith's account? This cannot be undone."
          )
        }
      >
        Delete account
      </Button>
    </>
  );
}
