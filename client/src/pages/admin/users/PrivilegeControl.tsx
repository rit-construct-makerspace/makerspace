import React from "react";
import {
  Alert,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Privilege from "../../../types/Privilege";

interface PrivilegeControlProps {
  privilege: Privilege;
}

export default function PrivilegeControl({ privilege }: PrivilegeControlProps) {
  const { user: currentUser } = useCurrentUser();

  const isAdmin = currentUser.role === "Admin";

  return (
    <>
      <Typography variant="h6" component="div" mt={6}>
        Access Level
      </Typography>
      <FormControl disabled={!isAdmin}>
        <RadioGroup
          row
          aria-labelledby="privilege-level"
          name="privilege-level"
          value={privilege}
        >
          <FormControlLabel
            value={Privilege.MAKER}
            control={<Radio />}
            label="Maker"
          />
          <FormControlLabel
            value={Privilege.LABBIE}
            control={<Radio />}
            label="Labbie"
          />
          <FormControlLabel
            value={Privilege.ADMIN}
            control={<Radio />}
            label="Admin"
          />
        </RadioGroup>
      </FormControl>
      {!isAdmin && (
        <Alert severity="info" sx={{ width: "max-content", mt: 2 }}>
          You do not have permission to change this.
        </Alert>
      )}
    </>
  );
}
