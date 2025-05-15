import { useEffect, useState } from "react";
import { Alert, Box, Divider, Stack } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_ZONES_WITH_HOURS, ZoneWithHours } from "../../../queries/getZones";
import ZoneCard from "./ZoneCard";
import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/announcementsQueries";
import AnnouncementCard from "./AnnouncementCard";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import GET_EVENTS, { MakeEvent } from "../../../queries/eventQueries"
import EventCard from "./EventCard";
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

    const [IDAlert, setIDAlert] = useState(true);

    const isMobile = width <= 1100;

    const getZonesResult = useQuery(GET_ZONES_WITH_HOURS);
    const getAnnouncementsResult = useQuery(GET_ANNOUNCEMENTS);
    const getEvents = useQuery(GET_EVENTS);


    return (
        <Box margin="30px 0px">
            <RequestWrapper loading={incrementSiteVisits.loading} error={incrementSiteVisits.error}><></></RequestWrapper>
            {((currentUser.cardTagID == null || currentUser.cardTagID == "") && IDAlert) &&
                <Alert variant="standard" color="warning" onClose={() => {setIDAlert(false)}}>
                    Your RIT ID has not been associated with your Makerspace account yet. Please speak to a member of staff in the makerspace to rectify this before using any makerspace equipment. Trainings and 3DPrinterOS will remain available.
                </Alert>
            }
            {/* Zones */}
            <RequestWrapper loading={getZonesResult.loading} error={getZonesResult.error}>
                <Stack direction={isMobile ? "column" : "row"} justifyContent="space-evenly" alignItems="center" spacing={2}>
                    {getZonesResult.data?.zones.map((zone: ZoneWithHours) => (
                        <ZoneCard id={zone.id} name={zone.name} hours={zone.hours} imageUrl={process.env.PUBLIC_URL + "/shed_acronym_vert.jpg"}/>
                    ))}
                </Stack>
            </RequestWrapper>
            {/* Announcments */}
            <RequestWrapper loading={getAnnouncementsResult.loading} error={getAnnouncementsResult.error}>
                <Box>
                    <Typography variant="h3" margin="30px 30px 10px 30px">Announcements</Typography>
                    <Stack direction={isMobile ? "column" : "row"} justifyContent="flex-start" alignItems="stretch" spacing={2}
                        divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem/>}
                        margin="0px 20px"
                    >
                        {getAnnouncementsResult.data?.getAllAnnouncements?.slice(2, getAnnouncementsResult.data?.getAllAnnouncements?.length)
                            .map((thisAnnouncement: Announcement) => (
                                <AnnouncementCard announcement={thisAnnouncement}/>
                        ))}
                    </Stack>
                </Box>
            </RequestWrapper>
            {/* Upcoming Events */}
            <RequestWrapper2 result={getEvents} render={(data) => {

                console.log(data);

                return (
                    <Box>
                        <Typography variant="h3" margin="30px 30px 10px 30px">Upcoming Events</Typography>
                        <Stack direction={isMobile ? "column" : "row"} justifyContent="flex-start" alignItems="stretch" spacing={2}
                            divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem/>}
                            margin="0px 20px"
                        >
                            {data.events.map((event: MakeEvent) => (
                                <EventCard
                                    name={event.name.text}
                                    description={event.name.html}
                                    summary={event.summary}
                                    url={event.url}
                                    start={event.start.local}
                                    end={event.end.local}
                                    logoUrl={event.logo.url} />
                            ))}
                        </Stack>
                    </Box>
                );
            }} />
            
        </Box>
    );
};