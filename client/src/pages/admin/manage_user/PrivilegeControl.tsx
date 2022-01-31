import React from "react";
import {
  Alert,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import User from "../../../types/User";

interface PrivilegeControlProps {
  user: User;
}

export default function PrivilegeControl({ user }: PrivilegeControlProps) {
  const { user: currentUser } = useCurrentUser();

  const isAdmin = currentUser.role === "Admin";

  return (
    <>
      <PageSectionHeader>Access Level</PageSectionHeader>
      <FormControl disabled={!isAdmin}>
        <RadioGroup
          row
          aria-labelledby="privilege-level"
          name="privilege-level"
          value={user.role}
        >
          <FormControlLabel value="Maker" control={<Radio />} label="Maker" />
          <FormControlLabel value="Labbie" control={<Radio />} label="Labbie" />
          <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
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
