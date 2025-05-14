import { useCurrentUser } from "../../../../common/CurrentUserProvider";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../../../lab_management/users/UserModal";
import InfoBlob from "../../../lab_management/users/InfoBlob";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { UPDATE_STUDENT_PROFILE } from "../../../maker/signup/SignupPage";
import RequestWrapper2 from "../../../../common/RequestWrapper2";

const StyledInfo = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 32px;
  width: 50%;
`;


export default function UserSettingsPage() {
    const currentUser = useCurrentUser();

    const userResult = useQuery(GET_USER, {variables: {id: currentUser.id}});
    const [updateStudentProfile, result] = useMutation(UPDATE_STUDENT_PROFILE);

    const [editInfo, setEditInfo] = useState(false);
    const [pronouns, setPronouns] = useState("");

    function handleSubmit() {
        setEditInfo(false);
        updateStudentProfile({
            variables: {
                userID: currentUser.id,
                pronouns,
                college: userResult.data?.user.college,
                expectedGraduation: userResult.data?.user.expectedGraduation
            },
            refetchQueries: [{ query: GET_USER }],
        });
    }

    return (
        <Stack margin="30px" width="100%" spacing={2} divider={<Divider orientation="horizontal" flexItem/>}>
            {/* Personal info */}
            <RequestWrapper2 result={userResult} render={({user}) => {
                
                if (pronouns === "") {
                    setPronouns(user.pronouns)
                }

                function handleOpen() {
                    setEditInfo(true);
                }

                return (
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    alt="Profile picture"
                                    src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                                    sx={{width: "60px", height: "60px"}}
                                />
                                <Typography variant="h3">{user.firstName} {user.lastName} ({user.ritUsername})</Typography>
                            </Stack>
                            <IconButton aria-label="edit information" onClick={handleOpen}>
                                <EditIcon sx={{width: "30px", height: "30px", color: "gray"}}/>
                            </IconButton>
                            <Dialog open={editInfo} onClose={() => {setEditInfo(false)}}>
                                <DialogTitle>Edit Personal Information</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Currently, only a limited amount of information can be edited.
                                    </DialogContentText>
                                    <TextField
                                        id="pronouns"
                                        name="pronouns"
                                        label="Pronouns"
                                        fullWidth
                                        variant="standard"
                                        defaultValue={pronouns}
                                        onChange={(e) => setPronouns(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setEditInfo(false)}}>Cancel</Button>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                        <StyledInfo>
                            <InfoBlob label="Pronous" value={pronouns}/>
                            <InfoBlob label="Role" value={user.privilege}/>
                        </StyledInfo>
                        <StyledInfo>
                            <InfoBlob label="College" value={user.college}/>
                            <InfoBlob label="Expected Graduation" value={user.expectedGraduation}/>
                        </StyledInfo>
                        <InfoBlob label="Member Since" value={user.registrationDate}/>
                    </Stack>
                );
            }}/>
                
            {/* Appearence (Dark Mode toggle) */}
            <Stack spacing={1}>
                <Typography variant="h3">Appearance</Typography>
                <Typography sx={{fontStyle: "italic"}}>Under Construction...</Typography>
            </Stack>
        </Stack>
    );
}