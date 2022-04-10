import React, { useEffect } from "react";
import PrettyModal from "../../../common/PrettyModal";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoBlob from "./InfoBlob";
import { format, parseISO } from "date-fns";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import PrivilegeControl from "./PrivilegeControl";
import { useNavigate } from "react-router-dom";
import HoldCard from "./HoldCard";
import Privilege from "../../../types/Privilege";

const StyledInfo = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 32px;
`;

export interface Hold {
  id: string;
  description: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  remover?: {
    firstName: string;
    lastName: string;
  };
  createDate: string;
  removeDate?: string;
}

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
      holds {
        id
        creator {
          firstName
          lastName
        }
        remover {
          firstName
          lastName
        }
        createDate
        removeDate
        description
      }
    }
  }
`;

export const CREATE_HOLD = gql`
  mutation CreateHold($userID: ID!, $description: String!) {
    createHold(userID: $userID, description: $description) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userID: ID!) {
    deleteUser(userID: $userID) {
      id
    }
  }
`;

interface UserModalProps {
  selectedUserID: string;
  onClose: () => void;
}

export default function UserModal({ selectedUserID, onClose }: UserModalProps) {
  const navigate = useNavigate();
  const [getUser, getUserResult] = useLazyQuery(GET_USER);
  const [createHold] = useMutation(CREATE_HOLD);
  const [deleteUser] = useMutation(DELETE_USER);

  useEffect(() => {
    if (selectedUserID) getUser({ variables: { id: selectedUserID } });
  }, [selectedUserID, getUser]);

  const handlePlaceHoldClicked = () => {
    const description = window.prompt("Enter hold description:");
    if (!description) {
      window.alert("Description required.");
      return;
    }

    createHold({
      variables: { userID: getUserResult.data.user.id, description },
      refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }],
    });
  };

  const handleDeleteUserClicked = () => {
    const fName = getUserResult.data.user.firstName;
    const lName = getUserResult.data.user.lastName;
    const result = window.confirm(
      `Are you sure you wish to delete ${fName} ${lName}'s account? This cannot be undone.`
    );
    if (result) {
      deleteUser({
        variables: {userID: getUserResult.data.user.id},
        refetchQueries: [{query: GET_USER, variables: {id: selectedUserID}}],
      });
    };
  }

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

            {user.holds.length === 0 && (
              <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body1" fontStyle="italic">
                  No holds.
                </Typography>
              </Stack>
            )}

            <Stack spacing={2}>
              {user.holds.map((hold: Hold) => (
                <HoldCard key={hold.id} hold={hold} userID={user.id} />
              ))}
            </Stack>

            <Button
              sx={{ mt: 2, alignSelf: "flex-start" }}
              variant="outlined"
              onClick={handlePlaceHoldClicked}
            >
              Place hold
            </Button>

            <Typography variant="h6" component="div" mt={6} mb={1}>
              Actions
            </Typography>

            <Stack direction="row" spacing={2}>
              {getUserResult.data.user.privilege === Privilege.ADMIN &&
                  <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUserClicked
                      }
                  >
                      Delete account
                  </Button>
              }
              <Button
                startIcon={<HistoryIcon />}
                variant="outlined"
                onClick={() => navigate(`/admin/history?q=<user:${user.id}:`)}
              >
                View logs
              </Button>
            </Stack>
          </Stack>
        )}
      />
    </PrettyModal>
  );
}
