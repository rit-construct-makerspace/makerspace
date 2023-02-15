import React, { useState } from "react";
import {Stack} from "@mui/material";
import Page from "../../Page";
import PageSectionHeader from "../../../common/PageSectionHeader";
import Reservations from "../../../test_data/Reservations";
import HomepageCard from "./HomepageCard";
import { useCurrentUser } from "../../../common/CurrentUserProvider";


const API_KEY = "AIzaSyB_pJ1Aiw6PxzXbwoengIwtHbr-CALyfUc";
const CALENDAR_ID = "jgf55spntac7p96ea6ql1uc710@group.calendar.google.com";

const Homepage: React.FC = () => {
    const currentUser = useCurrentUser();
    const welcomeMsg = "Welcome, " + currentUser.firstName;
    const [calendarUrl, setCalendarUrl] = useState(
        "https://calendar.google.com/calendar/embed?src=theconstruct.rit%40gmail.com&ctz=America%2FNew_York"
    );

    return (
        <Page title={welcomeMsg}>
            <HomepageCard />


        </Page>
    );
};

export default Homepage;
