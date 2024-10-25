import React, { ReactNode, useEffect, useState } from "react";
import PrettyModal from "../../../common/PrettyModal";
import { Button, Divider, MenuItem, Select, Stack, TextareaAutosize, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InventoryIcon from "@mui/icons-material/Inventory";
import { gql, useQuery } from "@apollo/client";

const GET_USERS_ID_AND_NAME = gql`
  query GetUsers {
    users {
      id
      ritUsername
      firstName
      lastName
    }
  }
`;


function StepNumber({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="h1"
      component="div"
      sx={{
        color: "primary.main",
        fontWeight: 700,
        width: "54px",
      }}
    >
      {children}
    </Typography>
  );
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onFinalize: (checkoutNotes: string, recievingUserID: number | undefined) => void;
}

export default function CheckoutModal({
  open,
  onClose,
  onFinalize,
}: CheckoutModalProps) {
  const [notes, setNotes] = useState<string>("")
  const [recievingUserID, setRecievingUserID] = useState<number>()

  function handleNotesChanged(e: any) {
    setNotes(e.target.value);
  }
  
  function handleRecievingUserIDChanged(e: any) {
    setRecievingUserID(e.target.value);
  }

  const users = useQuery(GET_USERS_ID_AND_NAME);

  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);
  const isMobile = width <= 1100;



  return (
    <PrettyModal open={open} onClose={onClose} width={isMobile ? 250 : 430}>
      <Stack spacing={2} px={2}>
        <Stack direction="row" spacing={4} alignItems="center">
          {!isMobile && <StepNumber>1</StepNumber>}
          <Stack spacing={1}>
            <Typography variant="body1" fontWeight={"bold"}>
              Complete transaction on
              <br />
              Tiger Bucks Transaction Portal.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              href="https://awrrit.atriumcampus.com/v2/shed"
              target="_blank"
            >
              Open portal
            </Button>
          </Stack>
        </Stack>

        <Divider flexItem />

        <Stack direction="row" spacing={4} alignItems="center">
        {!isMobile && <StepNumber>2</StepNumber>}
          <Stack spacing={1}>
            <Typography variant="body1" fontWeight={"bold"}>Update Construct inventory.</Typography>
            <Stack spacing={1}>
              <Typography variant="body1">Please select the user the selected items are being sold to below.</Typography>

              <Select
                value={recievingUserID}
                size="small"
                onChange={handleRecievingUserIDChanged}
              >
                {users.data?.users.map((user: {id: number, ritUsername: string, firstName: string, lastName: string}) => (
                  <MenuItem value={user.id}>{user.firstName} {user.lastName} ({user.ritUsername})</MenuItem>
                ))}
              </Select>

              <TextareaAutosize
                style={{ background: "none", fontFamily: "Roboto", fontSize: "1em", lineHeight: "2em", marginTop: "2em", marginBottom: "2em" }}
                aria-label="Notes"
                defaultValue={notes ?? ""}
                placeholder="Usage Notes"
                value={notes}
                onChange={handleNotesChanged} />
            </Stack>
            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              onClick={() => onFinalize(notes, recievingUserID)}
            >
              Update inventory
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </PrettyModal>
  );
}
