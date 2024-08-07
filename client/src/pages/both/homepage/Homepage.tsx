import React from "react";
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
// import RequestWrapper from "../../../common/RequestWrapper";
// import { useQuery } from "@apollo/client";
// import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";
//import UpcomingEventsCard from "./GoogleCalendarAPI";

const Homepage: React.FC = () => {
    const currentUser = useCurrentUser();
    const welcomeMsg = "Welcome, " + currentUser.firstName;
    const navigate = useNavigate();

    return (
        <Page title={welcomeMsg} maxWidth={"1250px"}>
            {( currentUser.cardTagID == null || currentUser.cardTagID == "" ) &&
            <Alert variant="standard" color="error">
                Your RIT ID has not been registered! You can still complete trainings but you must speak to a SHED Makerspace employee before gaining access to our equipment.
            </Alert>
            }
            <Typography variant="h5">Dashboard</Typography>
            <div className="flexo" style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignContent: "flex-start",
                gap: "1em"
            }}>
                {/* <AccountBalanceCard /> */}
                <Stack direction={"column"}>
                    <ResourcesCard />
                    <AnnouncementsCard />
                </Stack>
                <Stack direction={"column"}>
                    <IncompleteTrainingsCard onClick={() => navigate("/maker/training/")} />
                    <ExpiringSoonCard />
                </Stack>

                <Stack direction={"column"}>
                    <OperationHoursCard />
                    <UpcomingEventsCard />
                </Stack>
            </div>
        </Page>
    );
};

export default Homepage;
