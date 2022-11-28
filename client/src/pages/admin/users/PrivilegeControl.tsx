import React, { ChangeEvent } from "react";
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
import { gql, useMutation } from "@apollo/client";
import GET_USERS from "../../../queries/getUsers";
import { GET_USER } from "./UserModal";

const SET_PRIVILEGE = gql`
  mutation SetPrivilege($userID: ID!, $privilege: Privilege) {
    setPrivilege(userID: $userID, privilege: $privilege) {
      id
    }
  }
`;

interface PrivilegeControlProps {
  userID: string;
  privilege: Privilege;
}

export default function PrivilegeControl({
  userID,
  privilege,
}: PrivilegeControlProps) {
  const currentUser = useCurrentUser();
  const [setPrivilege, setPrivilegeResult] = useMutation(SET_PRIVILEGE);

  const isAdmin = currentUser.privilege === Privilege.STAFF;

  const handlePrivilegeChanged = (
    event: ChangeEvent<HTMLInputElement>,
    newValue: string
  ) => {
    setPrivilege({
      variables: { userID, privilege: newValue },
      refetchQueries: [
        { query: GET_USERS },
        { query: GET_USER, variables: { id: userID } },
      ],
    });
  };

  return (
    <>
      <Typography variant="h6" component="div" mt={6}>
        Access Level
      </Typography>

      <FormControl disabled={!isAdmin || setPrivilegeResult.loading}>
        <RadioGroup
          row
          aria-labelledby="privilege-level"
          name="privilege-level"
          value={privilege}
          onChange={handlePrivilegeChanged}
        >
          <FormControlLabel
            value={Privilege.MAKER}
            control={<Radio />}
            label="Maker"
          />
          <FormControlLabel
            value={Privilege.MENTOR}
            control={<Radio />}
            label="Mentor"
          />
          <FormControlLabel
            value={Privilege.STAFF}
            control={<Radio />}
            label="Staff"
          />
        </RadioGroup>
      </FormControl>
      {!isAdmin && (
        <Alert severity="info" sx={{ width: "max-content", mt: 1 }}>
          You do not have permission to change this.
        </Alert>
      )}
    </>
  );
}
