import React from "react";
import {
    Button,
    Card,
    Stack,
    Typography,
} from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";

export default function UpcomingEventsCard() {

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return (
        <Stack direction={"row"} justifyContent={"space-between"} marginTop={2}>

            <Card sx={{ width: 350, height: 100, padding: 2, border: 1, borderColor: "lightgrey" } } >
                <Typography variant="h4" color={"black"}>Balance</Typography>
                <Typography variant="h4" color={"darkorange"} align={"right"} marginBottom={0}>{useCurrentUser().balance}</Typography>
            </Card>

            <Card sx={{ width: 350, height: 150, padding: 2, border: 1, borderColor: "lightgrey" } } >
                <Typography variant="h4">Hours</Typography>
                <Typography variant="h6">Monday - Thursday 9:00am - 9:00pm</Typography>
                <Typography variant="h6">Friday 9:00am - 6:00pm</Typography>
                <Typography variant="h6">Saturday - Sunday 1:00pm - 5:00pm*</Typography>
            </Card>

            <Card sx={{ width: 300, padding: 2, border: 1, borderColor: "lightgrey" } } >
                    <Stack direction="column" alignItems="flex-start" spacing={1} justifyContent="space-evenly" >
                        <Typography variant="h4">Upcoming Events</Typography>
                        <Typography variant="h6" color={"darkorange"}>Today {month}/{day}</Typography>
                        <Typography variant="body1">6:00am: Get ready for work</Typography>
                        <Typography variant="body1">9:00am: Work day begins</Typography>
                        <Typography variant="body1">5:00pm: Return from work, greet wonderful wife</Typography>
                        <Typography variant="body1">5:30pm: Apologize for forgetting Valentine's Day</Typography>
                        <Typography variant="body1">6:00pm: Overcompensate for missing Valentine's Day</Typography>
                        <Typography variant="body1">6:03pm: Wife leaves.</Typography>
                        <Typography variant="body1">6:04pm: Feel shame.</Typography>
                        <Button href={"https://calendar.google.com/calendar/embed?src=jgf55spntac7p96ea6ql1uc710%40group.calendar.google.com&ctz=America%2FNew_York"} target="_blank">View Full Calendar</Button>
                    </Stack>

            </Card>
        </Stack>
    );
}
