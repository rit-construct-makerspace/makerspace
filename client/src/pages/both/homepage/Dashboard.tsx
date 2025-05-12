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
import { GET_ZONES_WITH_HOURS, ZoneWithHours } from "../../../queries/getZones";
import { ZoneDash } from "./ZoneDash";
import { HomeDash } from "./HomeDash";
import ZoneCard from "./ZoneCard";
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

    const getZonesResult = useQuery(GET_ZONES_WITH_HOURS);


    return (
        <Page title="" noPadding={isMobile}>
            <RequestWrapper loading={incrementSiteVisits.loading} error={incrementSiteVisits.error}><></></RequestWrapper>
            {(currentUser.cardTagID == null || currentUser.cardTagID == "") &&
                <Alert variant="standard" color="warning">
                    Your RIT ID has not been associated with your Makerspace account yet. Please speak to a member of staff in the makerspace to rectify this before using any makerspace equipment. Trainings and 3DPrinterOS will remain available.
                </Alert>
            }

            <RequestWrapper loading={getZonesResult.loading} error={getZonesResult.error}>
                <Stack direction="row" justifyContent="space-evenly" alignItems="center">
                    {getZonesResult.data?.zones.map((zone: ZoneWithHours) => (
                        <ZoneCard id={zone.id} name={zone.name} hours={zone.hours} imageUrl={process.env.PUBLIC_URL + "/shed_acronym_vert.jpg"}/>
                    ))}
                </Stack>
            </RequestWrapper>
        </Page>
    );
};