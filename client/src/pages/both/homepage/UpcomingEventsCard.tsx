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
import { gql, useQuery } from "@apollo/client";

const GET_EVENTS = gql`
  query Events {
    events {
      name {
        text
        html
      }
      description {
        text
        html
      }
      url
      start {
        timezone
        local
        utc
      }
      end {
        timezone
        local
        utc
      }
      summary
      logo {
        url
      }
    }
  }
`;


export default function UpcomingEventsCard() {

  const getEvents = useQuery(GET_EVENTS);

  return (
    <Card sx={{ minWidth: 250, maxWidth: 500, height: 500, p: "1em", px: '10px', border: 1, borderColor: "lightgrey", overflowY: 'scroll', borderRadius: 0 }} >
      <CardHeader title="Upcoming Events" subheader={(<Link to={process.env.REACT_APP_EVENTBRITE_PAGE_LINK ?? "#"}>View All</Link>)} sx={{ py: 0, fontWeight: 'bold' }}></CardHeader>
      <CardContent sx={{ px: '5px' }}>
        <RequestWrapper loading={getEvents.loading} error={getEvents.error}>
          <>
            {getEvents.data?.events.map((event: { name: { text: string; }; description: { html: string; }; summary: string; url: string; start: { local: string; }; end: { local: string; }; logo: { url: string; }; }) => (
              <EventCard name={event.name.text} description={event.description.html} summary={event.summary} url={event.url} start={event.start.local} end={event.end.local} logoUrl={event.logo?.url} />
            ))}
            {getEvents.data?.events.length == 0 && <Typography variant="body1" color={"gray"} ml={2}>No events.</Typography>}
          </>
        </RequestWrapper>
      </CardContent>
    </Card>
  );
}