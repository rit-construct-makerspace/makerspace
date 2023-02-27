import React, { useState } from "react";
import {Stack} from "@mui/material";
import Page from "../../Page";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Typography from "@mui/material/Typography";
import AccountBalanceCard from "./AccountBalanceCard";
import OperationHoursCard from "./OperationHoursCard";
import UpcomingEventsCard from "./UpcomingEventsCard";
import IncompleteTrainingsCard from "./IncompleteTrainingsCard";
import ExpiringSoonCard from "./ExpiringSoonCard";
import AnnouncementsCard from "./AnnouncementsCard";
//import UpcomingEventsCard from "./GoogleCalendarAPI";


const API_KEY = "AIzaSyB_pJ1Aiw6PxzXbwoengIwtHbr-CALyfUc";
const CALENDAR_ID = "c_1d2032584bf3324558da28ace1d5d1e522e3fca2de4e578589a31e4477fa522e@group.calendar.google.com";

const Homepage: React.FC = () => {
    const currentUser = useCurrentUser();
    const welcomeMsg = "Welcome, " + currentUser.firstName;

    return (
        <Page title={welcomeMsg} maxWidth={"1250px"}>
                <Typography variant="h5">Dashboard</Typography>
                <Stack direction={"row"} justifyContent={"space-between"} marginTop={2}>
                    <Stack direction={"column"} spacing={5}>
                        <AccountBalanceCard />
                            <ExpiringSoonCard />
                            <IncompleteTrainingsCard />
                    </Stack>

                        <Stack direction={"column"} spacing={5}>
                        <OperationHoursCard />
                        <AnnouncementsCard />
                    </Stack>

                    <Stack direction={"column"} spacing={15}>
                        <UpcomingEventsCard />
                    </Stack>
                </Stack>
        </Page>
    );
};

export default Homepage;
