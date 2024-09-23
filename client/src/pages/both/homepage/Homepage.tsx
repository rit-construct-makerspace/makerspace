import React, { useEffect, useState } from "react";
import { Alert, Stack } from "@mui/material";
import Page from "../../Page";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Typography from "@mui/material/Typography";
import AccountBalanceCard from "./AccountBalanceCard";
import OperationHoursCard from "./OperationHoursCard";
import UpcomingEventsCard from "./UpcomingEventsCard";
import IncompleteTrainingsCard from "./IncompleteTrainingsCard";
import ExpiringSoonCard from "./ExpiringSoonCard";
import AnnouncementsCard from "./AnnouncementsCard";
import { useNavigate } from "react-router-dom";
import { wrap } from "module";
import ResourcesCard from "./ResourcesCard";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
// import RequestWrapper from "../../../common/RequestWrapper";
// import { useQuery } from "@apollo/client";
// import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";
//import UpcomingEventsCard from "./GoogleCalendarAPI";

const INCREMENT_SITE_VISITS = gql`
    query IncrementSiteVisits {
        incrementSiteVisits
    }
`;

const Homepage: React.FC = () => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    const incrementSiteVisits = useQuery(INCREMENT_SITE_VISITS);

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
    const isMobile = width <= 768;


    return (
        <Page title="" maxWidth={"1250px"}>
            <RequestWrapper loading={incrementSiteVisits.loading} error={incrementSiteVisits.error}><></></RequestWrapper>
            {( currentUser.cardTagID == null || currentUser.cardTagID == "" ) &&
            <Alert variant="standard" color="error">
                Your RIT ID has not been registered! You can still complete trainings but you must speak to a SHED Makerspace employee before gaining access to our equipment.
            </Alert>
            }
            <Typography variant="h5">Dashboard</Typography>
            <Stack className="flexo" direction={isMobile ? "column" : "row"}>
                {/* <AccountBalanceCard /> */}
                <Stack direction={"column"}>
                    <ResourcesCard />
                    <AnnouncementsCard />
                </Stack>

                {!isMobile && <Stack direction={"column"}>
                    <IncompleteTrainingsCard onClick={() => navigate("/maker/training/")} />
                    <ExpiringSoonCard />
                </Stack>}

                <Stack direction={"column"}>
                    <OperationHoursCard />
                    <UpcomingEventsCard />
                </Stack>
            </Stack>
        </Page>
    );
};

export default Homepage;
