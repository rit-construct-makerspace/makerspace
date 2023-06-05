import Page from "../../Page";
import {Button, Grid, Stack, Typography} from "@mui/material";
import {useCallback} from "react";

export default function LogoutPromptPage() {


    const logout = useCallback(() => {
        console.log("Logging out...")
        fetch("http://localhost:3000/logout", {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            redirect: 'follow'
        })
            .catch(function(err) {
                console.info(err);
            });
    }, []);


    return (
        <Page title="Logout" maxWidth="1250px">


            <Typography variant={"h5"} style={{ color: "grey" }}>Are you sure you would like to logout?</Typography>

            {/*<form action="/logout" method="POST">*/}
            {/*    <input type="submit" value="Submit" />*/}
            {/*</form>*/}

            <Button onClick={logout}>
                Logout
            </Button>

        </Page>
    );
}
