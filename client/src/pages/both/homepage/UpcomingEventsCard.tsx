import {
    Button,
    Card, CardContent, Stack,
    Typography
} from "@mui/material";
import React from "react";

export default function UpcomingEventsCard() {

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return (
        <Card sx={{ width: 350, padding: 2, border: 1, borderColor: "lightgrey" } } >
            <CardContent>
                <Stack direction="column" alignItems="flex-start" spacing={2} justifyContent="space-evenly" >

                    <Stack direction="column" alignItems="flex-start" spacing={0} justifyContent="space-evenly">
                        <Typography variant="h4">Upcoming Events</Typography>
                        <Button style={{paddingLeft:'0px'}} sx={{ color:"darkorange" }} href={"https://calendar.google.com/calendar/embed?src=jgf55spntac7p96ea6ql1uc710%40group.calendar.google.com&ctz=America%2FNew_York"} target="_blank">View Full Calendar</Button>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={5}>
                        <Typography variant="h5">{month}/{day}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">11:00 AM</Typography>
                            <Typography variant={"h5"}>SHED Open House Event</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={5}>
                        <Typography variant="h5">{month}/{day}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">1:00 PM</Typography>
                            <Typography variant={"h5"}>Water Cutting Class Session with Mentors</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={5}>
                        <Typography variant="h5">{month}/{day}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">2:00 PM</Typography>
                            <Typography variant={"h5"}>3D Print Training Session</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={5}>
                        <Typography variant="h5">{month}/{day}</Typography>
                        <Stack direction="column" spacing={1}>
                            <Typography variant="h6">3:00 PM</Typography>
                            <Typography variant={"h5"}>Q&A With Student Staff</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}