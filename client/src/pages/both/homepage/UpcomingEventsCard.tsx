import {
  Button,
  Card, CardContent, CardHeader, Stack,
  Typography
} from "@mui/material";
import RequestWrapper from "../../../common/RequestWrapper";
import EventCard from "./EventCard";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Link } from "react-router-dom";


export default function UpcomingEventsCard() {

  const [content, setContent] = useState([]);

  const [fetchOK, setFetchOK] = useState(true);

  useEffect(() => {
    const url = (process.env.REACT_APP_EVENTBRITE_API_LIST_EVENTS_URL ?? "") + "?token=" + (process.env.REACT_APP_EVENTBRITE_API_KEY ?? "invalid") + "&order_by=start_asc&time_filter=current_future&page_size=15";
    const eventsFetchResponse = fetch(url);
    eventsFetchResponse.then((response) => response.json().then((json) => {
      setFetchOK(response.ok)
      setContent(json.events);
    }));
  }, []);

  if (!process.env.REACT_APP_EVENTBRITE_API_LIST_EVENTS_URL || !fetchOK) {
    return (
      <Card sx={{ minWidth: 250, minHeight: 250, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1 }} >
        <CardContent>
          Cannot get Events
        </CardContent>
      </Card>
    );
  }

  console.log(content)

  return (
    <Card sx={{ minWidth: 250, maxWidth: 500, height: 500, py: 2, px: '10px', border: 1, borderColor: "lightgrey", overflowY: 'scroll' }} >
      <CardHeader title="Upcoming Events" subheader={(<Link to={process.env.REACT_APP_EVENTBRITE_PAGE_LINK ?? "#"}>View All</Link>)} sx={{py: 0, fontWeight: 'bold'}}></CardHeader>
      <CardContent sx={{px: '5px'}}>
        {content.map((event: { name: { text: string; }; description: { html: string; }; summary: string; url: string; start: { local: string; }; end: { local: string; }; logo: { url: string; }; }) => (
          <EventCard name={event.name.text} description={event.description.html} summary={event.summary} url={event.url} start={event.start.local} end={event.end.local} logoUrl={event.logo.url} />
        ))}
        {content.length == 0 && <Typography variant="body1" color={"gray"} ml={2}>No events.</Typography>}
      </CardContent>
    </Card>
  );
}