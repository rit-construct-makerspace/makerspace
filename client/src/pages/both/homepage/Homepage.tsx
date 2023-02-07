// import React from "react";
// import Page from "../../Page";
// import { useQuery } from "@apollo/client";
// import { useParams } from "react-router-dom";
// import { GET_MODULE } from "../../../queries/modules";
// import RequestWrapper2 from "../../../common/RequestWrapper2";
// import RequestWrapper from "../../../common/RequestWrapper";
// import {Button, Grid, Stack} from "@mui/material";
// import BalanceCard from "../../both/homepage/BalanceCard";
// // import { ReactEmbeddedGoogleCalendar } from 'react-embedded-google-calendar';
// import Embed from "react-embed";
//
//
// export default function Homepage() {
//     const { id } = useParams<{ id: string }>();
//     const result = useQuery(GET_MODULE, { variables: { id } });
//
//     return (
//         <Page title="Home">
//             <Stack direction="row" flexWrap="wrap">
//                 <Embed url = "https://calendar.google.com/calendar/embed?src=theconstruct.rit%40gmail.com&ctz=America%2FNew_York"/>
//             </Stack>
//         </Page>
//     );
// }

import React, { useState } from "react";
import Iframe from "react-iframe";
import {Stack} from "@mui/material";
import Page from "../../Page";

const Homepage: React.FC = () => {
    const [calendarUrl, setCalendarUrl] = useState(
        "https://calendar.google.com/calendar/embed?src=theconstruct.rit%40gmail.com&ctz=America%2FNew_York"
    );

    return (
        <Page title="Home">
            <Stack direction="row">
                    <Iframe
                        url={calendarUrl}
                        width="300"
                        height="300"
                        frameBorder={0}
                        scrolling="no"
                        styles={{
                            position: "absolute",
                            top: 100,
                            right: 20
                        }}
                    />
            </Stack>
        </Page>
    );
};

export default Homepage;
