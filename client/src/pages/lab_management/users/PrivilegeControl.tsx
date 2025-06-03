import { Checkbox, FormGroup, Stack, Typography } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import { FormControlLabel } from "@material-ui/core";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { SET_USER_ADMIN } from "../../../queries/permissionQueries";


interface PrivilegeControlProps {
    user: any;
    isMobile: boolean;
}

export default function PrivilegeControl(props: PrivilegeControlProps) {
    const currentUser = useCurrentUser();

    const [adminState, setAdminState] = useState(props.user.admin);
    const [setAdmin] = useMutation(SET_USER_ADMIN);

    function handleAdminChange(e: ChangeEvent<{}>, checked: boolean) {
        setAdminState(checked);
        setAdmin({variables: {userID: props.user.id, admin: checked}})
    }

    return (
        <Stack>
            <Typography variant="h6" component="div">
                Permissions
            </Typography>
            <FormGroup>
                <FormControlLabel
                    label="Admin"
                    checked={adminState}
                    control={<Checkbox/>}
                    disabled={!currentUser.admin || props.user.id === currentUser.id}
                    onChange={handleAdminChange}
                />
            </FormGroup>
        </Stack>
    );
}
