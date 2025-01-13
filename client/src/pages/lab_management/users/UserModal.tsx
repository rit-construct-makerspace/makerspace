import React, { ChangeEvent, useEffect, useState } from "react";
import PrettyModal from "../../../common/PrettyModal";
import { Avatar, Box, Button, Card, Chip, MenuItem, Select, Stack, TextareaAutosize, Typography } from "@mui/material";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
import { PassedModule, useCurrentUser } from "../../../common/CurrentUserProvider";
import CloseButton from "../../../common/CloseButton";
import CardTagSettings from "./CardTagSettings";
import AccessCheckCard from "./AccessCheckCard";
import ActionButton from "../../../common/ActionButton";
import GET_EQUIPMENTS, { GET_ALL_EQUIPMENTS } from "../../../queries/equipmentQueries";
import RequestWrapper from "../../../common/RequestWrapper";

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

export interface AccessCheck {
  id: string;
  equipmentID: string;
  approved: boolean;
}

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      pronouns      
      college
      expectedGraduation
      registrationDate
      privilege
      ritUsername
      cardTagID
      notes
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
      accessChecks {
        id
        equipmentID
        approved
      }
      passedModules {
        moduleID
        moduleName
        submissionDate
      }
      trainingHolds {
        id
        module {
          id
          name
        }
        expires
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

export const SET_NOTES = gql`
  mutation SetNotes($userID: ID!, $notes: String!) {
    setNotes(userID: $userID, notes: $notes) {
      id
    }
  }
`;

export const ARCHIVE_USER = gql`
  mutation ArchiveUser($userID: ID!) {
    archiveUser(userID: $userID) {
      id
    }
  }
`;

const REFRESH_CHECKS = gql`
  mutation RefreshAccessChecks($userID: ID!) {
    refreshAccessChecks(userID: $userID)
  }
`;

const CREATE_CHECK = gql`
  mutation CreateAccessCheck($userID: ID!, $equipmentID: ID!) {
    createAccessCheck(userID: $userID, equipmentID: $equipmentID)
  }
`;

const DELETE_TRAINING_HOLD = gql`
  mutation DeleteTrainingHold($id: ID!) {
    deleteTrainingHold(id: $id)
  }
`;


interface UserModalProps {
  selectedUserID: string;
  onClose: () => void;
}

export default function UserModal({ selectedUserID, onClose }: UserModalProps) {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [notes, setNotes] = useState<string>();
  const [openCreateCheckDialouge, setOpenCreateCheckDialouge] = useState<boolean>();
  const [newCheckEquipmentID, setNewCheckEquipmentID] = useState<string>();

  const [getUser, getUserResult] = useLazyQuery(GET_USER);
  const getEquipment = useQuery(GET_ALL_EQUIPMENTS)
  const [createHold] = useMutation(CREATE_HOLD);
  const [deleteUser] = useMutation(ARCHIVE_USER);
  const [setNotesMutation] = useMutation(SET_NOTES);
  const [refreshCheck, refreshCheckResult] = useMutation(REFRESH_CHECKS, { variables: { userID: selectedUserID }, refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }] });
  const [createCheck] = useMutation(CREATE_CHECK, { refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }] });
  const [deleteTrainingHold] = useMutation(DELETE_TRAINING_HOLD, { refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }] });

  useEffect(() => {
    if (selectedUserID) getUser({ variables: { id: selectedUserID } });
  }, [selectedUserID, getUser]);

  const handlePlaceHoldClicked = () => {
    const description = window.prompt("Enter hold description:");
    if (description == "") {
      window.alert("Description required.");
      return;
    }
    else if (!description) {
      return;
    }

    createHold({
      variables: { userID: getUserResult.data.user.id, description },
      refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }],
    });
  };

  // const handleDeleteUserClicked = () => {
  //   const fName = getUserResult.data.user.firstName;
  //   const lName = getUserResult.data.user.lastName;
  //   const result = window.confirm(
  //     `Are you sure you wish to delete ${fName} ${lName}'s account? This cannot be undone.`
  //   );
  //   if (result) {
  //     deleteUser({
  //       variables: { userID: getUserResult.data.user.id },
  //       refetchQueries: [{ query: GET_USER, variables: { id: selectedUserID } }],
  //     });
  //   };
  // }

  function handleTrainingHoldDeleteClick(id: number) {
    deleteTrainingHold({variables: {id}});
  }

  function handleCheckCreate() {
    if (!newCheckEquipmentID) return;
    createCheck({ variables: { userID: selectedUserID, equipmentID: newCheckEquipmentID } });
    setOpenCreateCheckDialouge(false);
  }

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

  const handleNotesChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotes(event.target.value)
  };

  return (
    <PrettyModal open={!!selectedUserID} onClose={onClose} width={isMobile ? 250 : 600}>
      <RequestWrapper2
        result={getUserResult}
        render={({ user }) => (
          <Stack>
            <CloseButton onClick={() => navigate("/admin/people")} />
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
                  {`${user.firstName} ${user.lastName}  (${user.ritUsername})`}
                </Typography>
                <Typography>{user.pronouns}</Typography>
              </Stack>
            </Stack>

            <StyledInfo>
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
              Access Checks
            </Typography>

            {user.accessChecks == null || user.accessChecks.length === 0 && (
              <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body1" fontStyle="italic">
                  No avaiable checks.
                </Typography>
              </Stack>
            )}

            <Stack direction={"row"} spacing={1}>
              <ActionButton iconSize={5} color="info" appearance={"small"} variant="outlined" handleClick={async () => { refreshCheck() }} loading={refreshCheckResult.loading} buttonText="Refresh Checks" tooltipText="Purge all unapproved checks and repopulate based on currently passed modules." />
              {currentUser.privilege == Privilege.STAFF && <ActionButton iconSize={5} color="primary" appearance={"small"} variant="outlined" handleClick={async () => { setOpenCreateCheckDialouge(!openCreateCheckDialouge) }} loading={false} buttonText="Create Check" />}
            </Stack>
            {openCreateCheckDialouge && <Stack direction={"row"} mt={1}>
              <RequestWrapper loading={getEquipment.loading} error={getEquipment.error}>
                <Select value={newCheckEquipmentID} onChange={(e) => setNewCheckEquipmentID(e.target.value)} sx={{ width: "50%" }}>
                  {getEquipment.data?.allEquipment.map((equipment: { id: number, name: string, archived: boolean }) => (
                    <MenuItem value={equipment.id}>{equipment.name} {equipment.archived && <Chip variant="outlined" color="warning" size="small" label="hidden" sx={{ ml: "1em" }} />}</MenuItem>
                  ))}
                </Select>
              </RequestWrapper>
              <Button variant="outlined" color="success" onClick={handleCheckCreate}>Create</Button>
            </Stack>}

            <Stack spacing={2} mt={2}>
              {user.accessChecks != null && user.accessChecks.map((accessCheck: AccessCheck) => (
                <AccessCheckCard key={accessCheck.id} accessCheck={accessCheck} userID={user.id} />
              ))}
            </Stack>


            <Typography variant="h6" component="div" mt={6} mb={1}>
              Passed Trainings
            </Typography>

            {user.passedModules == null || user.passedModules.length === 0 && (
              <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
                <CheckCircleIcon color="error" fontSize="small" />
                <Typography variant="body1" fontStyle="italic">
                  No trainings.
                </Typography>
              </Stack>
            )}

            <Box sx={{ maxHeight: "300px", overflowY: "scroll" }}>
              <Stack spacing={0.5}>
                {user.passedModules != null && user.passedModules.map((module: { moduleID: number, moduleName: string, submissionDate: string }) => (
                  <Card sx={{ p: "0.25em", backgroundColor: (localStorage.getItem("themeMode") == "dark" ? "grey.900" : "grey.100"), border: `1px solid grey` }}>
                    <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
                      <Typography>{module.moduleName}</Typography>
                      <Typography>{format(new Date(module.submissionDate), "M/d/yy h:mmaaa")}</Typography>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>


            <Typography variant="h6" component="div" mt={6} mb={1}>
              Locked Trainings
            </Typography>

            {user.trainingHolds == null || user.trainingHolds.length === 0 && (
              <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
                <CheckCircleIcon color="error" fontSize="small" />
                <Typography variant="body1" fontStyle="italic">
                  No trainings.
                </Typography>
              </Stack>
            )}

            <Box sx={{ maxHeight: "300px", overflowY: "scroll" }}>
              <Stack spacing={0.5}>
                {user.trainingHolds != null && user.trainingHolds.map((hold: { id: number; expires: Date; module: {id: number; name: string} }) => (
                  <Card sx={{ p: "0.25em", backgroundColor: (localStorage.getItem("themeMode") == "dark" ? "grey.900" : "grey.100"), border: `1px solid grey` }}>
                    <Stack direction={"row"} alignItems={"center"} sx={{ justifyContent: "space-between" }}>
                      <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <Typography color={"secondary"}><b>Exp: </b>{format(new Date(hold.expires), "M/d/yy h:mmaaa")}</Typography>
                        <Typography>{hold.module.name}</Typography>
                      </Stack>
                      <Button variant="text" color="success" onClick={() => handleTrainingHoldDeleteClick(hold.id)}>Unlock</Button>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>


            <Typography variant="h6" component="div" mt={6} mb={1}>
              Actions
            </Typography>

            <Stack direction="row" spacing={2}>
              {/* currentUser.privilege === Privilege.STAFF &&
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteUserClicked
                  }
                >
                  Delete account
                </Button>
              */}
              <Button
                startIcon={<HistoryIcon />}
                variant="outlined"
                onClick={() => navigate(`/admin/history?q=<user:${user.id}:`)}
              >
                View logs
              </Button>
            </Stack>

            <CardTagSettings userID={user.id} hasCardTag={(user.cardTagID != null && user.cardTagID != "")} />

            {currentUser.privilege == Privilege.STAFF &&
              <>
                <Typography variant="h6" component="div" mt={6} mb={1}>
                  Notes
                </Typography>

                <TextareaAutosize
                  style={{ background: "none", fontFamily: "Roboto", fontSize: "1em", lineHeight: "2em", marginTop: "2em", marginBottom: "2em" }}
                  aria-label="Notes"
                  defaultValue={user.notes ?? ""}
                  placeholder="Notes"
                  value={notes}
                  onChange={handleNotesChanged}
                  onSubmit={(e) => setNotesMutation({ variables: { userID: selectedUserID, notes: notes } })}></TextareaAutosize>
                <Button
                  variant="contained"
                  onClick={() => setNotesMutation({ variables: { userID: selectedUserID, notes: notes } })}
                  sx={{ mt: 8, alignSelf: "flex-end" }}
                >
                  Update Notes
                </Button>
              </>}
          </Stack>
        )}
      />
    </PrettyModal>
  );
}
