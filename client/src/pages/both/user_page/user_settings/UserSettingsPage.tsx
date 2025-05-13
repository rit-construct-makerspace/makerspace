import { useCurrentUser } from "../../../../common/CurrentUserProvider";
import { Alert, Avatar, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../../lab_management/users/UserModal";
import RequestWrapper from "../../../../common/RequestWrapper";
import InfoBlob from "../../../lab_management/users/InfoBlob";
import styled from "styled-components";

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

    return (
        <Stack margin="30px" width="100%" spacing={2} divider={<Divider orientation="horizontal" flexItem/>}>
            {/* Personal info */}
            <RequestWrapper loading={userResult.loading} error={userResult.error}>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            alt="Profile picture"
                            src="https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                            sx={{width: "60px", height: "60px"}}
                        />
                        <Typography variant="h3">{userResult.data?.user.firstName} {userResult.data?.user.lastName} ({userResult.data?.user.ritUsername})</Typography>
                    </Stack>
                    <StyledInfo>
                        <InfoBlob label="Pronous" value={userResult.data?.user.pronouns}/>
                        <InfoBlob label="Role" value={userResult.data?.user.privilege}/>
                    </StyledInfo>
                    <StyledInfo>
                        <InfoBlob label="College" value={userResult.data?.user.college}/>
                        <InfoBlob label="Expected Graduation" value={userResult.data?.user.expectedGraduation}/>
                    </StyledInfo>
                    <InfoBlob label="Member Since" value={userResult.data?.user.registrationDate}/>
                </Stack>
            </RequestWrapper>
            {/* Appearence (Dark Mode toggle) */}
            <Stack spacing={1}>
                <Typography variant="h3">Appearance</Typography>
                <Typography sx={{fontStyle: "italic"}}>Under Construction...</Typography>
            </Stack>
        </Stack>
    );
}