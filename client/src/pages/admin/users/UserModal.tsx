import React, { useEffect } from "react";
import PrettyModal from "../../../common/PrettyModal";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoBlob from "./InfoBlob";
import { format, parseISO } from "date-fns";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import PrivilegeControl from "./PrivilegeControl";

const StyledInfo = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 32px;
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      pronouns
      email
      college
      expectedGraduation
      registrationDate
      privilege
    }
  }
`;

interface UserModalProps {
  selectedUserID: string;
  onClose: () => void;
}

export default function UserModal({ selectedUserID, onClose }: UserModalProps) {
  const [getUser, getUserResult] = useLazyQuery(GET_USER);

  useEffect(() => {
    if (selectedUserID) getUser({ variables: { id: selectedUserID } });
  }, [selectedUserID, getUser]);

  return (
    <PrettyModal open={!!selectedUserID} onClose={onClose} width={600}>
      <RequestWrapper2
        result={getUserResult}
        render={({ user }) => (
          <Stack>
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <Avatar
                alt=""
                src={
                  // TODO: replace this with the user's profile pic
                  "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                }
                sx={{ width: 80, height: 80 }}
              />
              <Stack>
                <Typography variant="h5" component="div" fontWeight={500}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography>{user.pronouns}</Typography>
              </Stack>
            </Stack>

            <StyledInfo>
              <InfoBlob label="Email" value={user.email} />
              <InfoBlob
                label="Member Since"
                value={format(parseISO(user.registrationDate), "MM/dd/yyyy")}
              />
              <InfoBlob label="College" value={user.college} />
              <InfoBlob
                label="Expected Graduation"
                value={user.expectedGraduation}
              />
            </StyledInfo>

            <PrivilegeControl userID={user.id} privilege={user.privilege} />

            <Typography variant="h6" component="div" mt={6} mb={1}>
              Account Holds
            </Typography>

            <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
              <CheckCircleIcon color="success" fontSize="small" />

              {/* TODO: query and display holds */}
              <Typography variant="body1" fontStyle="italic">
                No holds.
              </Typography>
            </Stack>

            <Button
              sx={{ mt: 1.5, alignSelf: "flex-start" }}
              variant="outlined"
            >
              Place hold
            </Button>

            <Typography variant="h6" component="div" mt={6} mb={1}>
              Actions
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() =>
                  window.confirm(
                    "Are you sure you wish to delete John Smith's account? This cannot be undone."
                  )
                }
              >
                Delete account
              </Button>
              <Button startIcon={<HistoryIcon />} variant="outlined">
                View logs
              </Button>
            </Stack>
          </Stack>
        )}
      />
    </PrettyModal>
  );
}
