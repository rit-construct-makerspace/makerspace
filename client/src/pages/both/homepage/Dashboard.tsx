import React, { useEffect, useState } from "react";
import { Alert, Box, Stack, Tab, Tabs } from "@mui/material";
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
import { FullZone, GET_FULL_ZONES, GET_ZONES_WITH_HOURS } from "../../../queries/getZones";
import { ZoneDash } from "./ZoneDash";
import { HomeDash } from "./HomeDash";
// import RequestWrapper from "../../../common/RequestWrapper";
// import { useQuery } from "@apollo/client";
// import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";
//import UpcomingEventsCard from "./GoogleCalendarAPI";

const INCREMENT_SITE_VISITS = gql`
    query IncrementSiteVisits {
        incrementSiteVisits
    }
`;

export function Dashboard() {
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
    const isMobile = width <= 1100;

    const getZonesResult = useQuery(GET_FULL_ZONES);
    const [currentTab, setCurrentTab] = useState(0);


    return (
        <Page title="" noPadding={isMobile}>
            <RequestWrapper loading={incrementSiteVisits.loading} error={incrementSiteVisits.error}><></></RequestWrapper>
            {(currentUser.cardTagID == null || currentUser.cardTagID == "") &&
                <Alert variant="standard" color="error">
                    Your RIT ID has not been registered! You can still complete trainings but you must speak to a SHED Makerspace employee before gaining access to our equipment.
                </Alert>
            }

            <RequestWrapper loading={getZonesResult.loading} error={getZonesResult.error}>
                <Box width={"100%"}>
                    <Tabs sx={{'.MuiTab-root': {fontSize: isMobile ? "0.8em" : "1.3em"}, width: "100%"}} value={currentTab} onChange={((e, x) => setCurrentTab(x))} aria-label="Area Dashboards" variant={isMobile ? "fullWidth" : "scrollable"} scrollButtons="auto" allowScrollButtonsMobile >
                        <Tab label={"Home"} id={"simple-tab-0"} aria-controls={"simple-tab-panel-0"} value={0} />
                        {getZonesResult.data?.zones.map((zone: FullZone) => (
                            <Tab label={zone.name} id={"simple-tab-" + zone.id} aria-controls={"simple-tab-panel-" + zone.id} value={zone.id} />
                        ))}
                    </Tabs>
                    
                    {currentTab == 0 && <HomeDash />}
                    {getZonesResult.data?.zones.map((zone: FullZone) => (
                        <ZoneDash zone={zone} open={currentTab == zone.id}/>
                    ))}
                </Box>
            </RequestWrapper>
        </Page>
    );
};