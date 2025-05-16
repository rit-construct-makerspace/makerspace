import { useCurrentUser } from "../../../../common/CurrentUserProvider";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../../../lab_management/users/UserModal";
import InfoBlob from "../../../lab_management/users/InfoBlob";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import { UPDATE_STUDENT_PROFILE } from "../../../maker/signup/SignupPage";
import RequestWrapper2 from "../../../../common/RequestWrapper2";

const StyledInfo = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 32px;
  width: auto;
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
        <Stack margin={isMobile ? "10px" : "30px"} width={isMobile ? "fit-content" : "auto"} spacing={2} divider={<Divider orientation="horizontal" flexItem/>}>
            {/* Personal info */}
            <RequestWrapper2 result={userResult} render={({user}) => {
                
                if (pronouns === "") {
                    setPronouns(user.pronouns)
                }

                function handleOpen() {
                    setEditInfo(true);
                }

                function handleClose() {
                    setEditInfo(false);
                    setPronouns(user.pronouns);
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
                                <Typography variant={isMobile ? "h5" : "h3"}>{user.firstName} {user.lastName} ({user.ritUsername})</Typography>
                            </Stack>
                            <IconButton aria-label="edit information" onClick={handleOpen}>
                                <EditIcon sx={{width: "30px", height: "30px", color: "gray"}}/>
                            </IconButton>
                            <Dialog open={editInfo} onClose={handleClose}>
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
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleSubmit}>Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                        <Grid container justifyContent="space-around" maxWidth={isMobile ? undefined : "750px"}>
                            <Grid item minWidth="155px">
                                <InfoBlob label="Pronous" value={pronouns}/>
                            </Grid>
                            <Grid item minWidth="155px">
                                <InfoBlob label="Role" value={user.privilege}/>
                            </Grid>
                            <Grid item minWidth="155px">
                                <InfoBlob label="College" value={user.college}/>
                            </Grid>
                            <Grid item minWidth="155px">
                                <InfoBlob label="Expected Graduation" value={user.expectedGraduation}/>
                            </Grid>
                        </Grid>
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