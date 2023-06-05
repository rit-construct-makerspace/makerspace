import Page from "../../Page";
import {Button, Grid, Stack, Typography} from "@mui/material";

export default function LogoutPromptPage() {


    // function handleLogout = () = {
    //     const response = await fetch("/logout", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         credentials: 'same-origin'
    //     });
    //
    // }


    return (
        <Page title="Logout" maxWidth="1250px">


            <Typography variant={"h5"} style={{ color: "grey" }}>Are you sure you would like to logout?</Typography>

            <form action="/logout" method="POST">
                <input type="submit" value="Submit" />
            </form>

            {/*<Button onClick={handleLogout}>*/}
            {/*    Logout*/}
            {/*</Button>*/}

        </Page>
    );
}
