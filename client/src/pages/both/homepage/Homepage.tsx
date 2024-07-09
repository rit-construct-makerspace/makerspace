import React from "react";
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
import { useNavigate } from "react-router-dom";
import { wrap } from "module";
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
                <Typography variant="h5">Dashboard</Typography>
                <div className="flexo" style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    alignContent: "flex-start",
                    gap: "1em"
                }}>
                    {/* <AccountBalanceCard /> */}
                    <ExpiringSoonCard />
                    <IncompleteTrainingsCard onClick={() => navigate("/maker/training/")}/>

                    <OperationHoursCard />
                    <AnnouncementsCard/>

                    <UpcomingEventsCard />
                </div>
        </Page>
    );
};

export default Homepage;
