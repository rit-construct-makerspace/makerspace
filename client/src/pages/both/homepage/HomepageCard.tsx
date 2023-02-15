import React from "react";
import {
    Card,
    Stack,
    Typography,
} from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";

export default function UpcomingEventsCard() {

    return (
        <Stack direction={"row"}>
            <Card sx={{ width: 400, height: 100, marginTop: 2, padding: 2, border: 1, borderColor: "lightgrey" } } >
                <Typography variant="h4" color={"black"}>Balance</Typography>
                <Typography variant="h4" color={"darkorange"} align={"right"} marginTop={3}>{useCurrentUser().balance}</Typography>
            </Card>

            <Card sx={{ width: 300, marginRight: 0, marginLeft: 70, marginTop: 2, padding: 2, border: 1, borderColor: "lightgrey" } } >
                <Stack direction="column" alignItems="flex-start" spacing={1} justifyContent="space-evenly" >
                    <Typography variant="h4">Upcoming Events</Typography>
                    <Typography variant="h6" color={"darkorange"}>Today 2/14</Typography>
                    <Typography variant="body1">6:00am: Get ready for work</Typography>
                    <Typography variant="body1">9:00am: Work day begins</Typography>
                    <Typography variant="body1">5:00pm: Return from work, greet wonderful wife</Typography>
                    <Typography variant="body1">5:30pm: Apologize for forgetting Valentine's Day</Typography>
                    <Typography variant="body1">6:00pm: Overcompensate for missing Valentine's Day</Typography>
                    <Typography variant="body1">6:03pm: Wife leaves.</Typography>
                    <Typography variant="body1">6:04pm: Feel shame.</Typography>
                </Stack>
            </Card>
        </Stack>
    );
}
