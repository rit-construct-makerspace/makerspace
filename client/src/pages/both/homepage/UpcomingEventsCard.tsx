import {
  Box,
  Button,
  Card, CardContent, CardHeader, Collapse, Stack,
  SxProps,
  Typography
} from "@mui/material";
import RequestWrapper from "../../../common/RequestWrapper";
import EventCard from "./EventCard";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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


const desktopStyle: SxProps = { minWidth: 250, maxWidth: 500, maxHeight: 1000, p: "1em", px: '10px', border: 1, borderColor: "lightgrey", overflowY: 'scroll', borderRadius: 0 };
const mobileStyle: SxProps = { minWidth: 250, maxWidth: 500, height: 'auto', p: "1em", px: '10px', border: 1, borderColor: "lightgrey", overflowY: 'hidden', borderRadius: 0 };


export default function UpcomingEventsCard() {

  const getEvents = useQuery(GET_EVENTS);

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

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={isMobile ? mobileStyle : desktopStyle} >
      <CardHeader title="Upcoming Events" subheader={(<Link to={process.env.REACT_APP_EVENTBRITE_PAGE_LINK ?? "#"}>View All</Link>)} sx={{ py: 0, fontWeight: 'bold' }}></CardHeader>
      <CardContent sx={{ px: '5px' }}>
        {!isMobile
          ? <RequestWrapper loading={getEvents.loading} error={getEvents.error}>
            <>
              {getEvents.data?.events.map((event: { name: { text: string; }; description: { html: string; }; summary: string; url: string; start: { local: string; }; end: { local: string; }; logo: { url: string; }; }) => (
                <EventCard name={event.name.text} description={event.description.html} summary={event.summary} url={event.url} start={event.start.local} end={event.end.local} logoUrl={event.logo?.url} />
              ))}
              {getEvents.data?.events.length == 0 && <Typography variant="body1" color={"gray"} ml={2}>No events.</Typography>}
            </>
          </RequestWrapper>

          : <RequestWrapper loading={getEvents.loading} error={getEvents.error}>
            <Stack direction={"column"}>
              <Stack spacing={1}>
                {getEvents.data?.events.slice(0, Math.min(2, getEvents.data?.events?.length))
                  .map((event: { name: { text: string; }; description: { html: string; }; summary: string; url: string; start: { local: string; }; end: { local: string; }; logo: { url: string; }; }) => (
                    <EventCard name={event.name.text} description={event.description.html} summary={event.summary} url={event.url} start={event.start.local} end={event.end.local} logoUrl={event.logo?.url} />
                  ))}
                {getEvents.data?.events.length == 0 && <Typography variant="body1" color={"gray"} ml={2}>No events.</Typography>}
              </Stack>
              {getEvents.data?.getAllAnnouncements?.length > 2 &&
                <Box>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {getEvents.data?.getAllAnnouncements?.slice(2, getEvents.data?.getAllAnnouncements?.length)
                      .map((event: { name: { text: string; }; description: { html: string; }; summary: string; url: string; start: { local: string; }; end: { local: string; }; logo: { url: string; }; }) => (
                        <EventCard name={event.name.text} description={event.description.html} summary={event.summary} url={event.url} start={event.start.local} end={event.end.local} logoUrl={event.logo?.url} />
                      ))}
                  </Collapse>
                  <Stack direction={"row"} onClick={handleExpandClick}>
                    {!expanded ? <ExpandMore
                      aria-expanded={expanded}
                      aria-label="Show More"
                      color="primary"
                    ></ExpandMore>
                      : <ExpandLess
                        aria-expanded={expanded}
                        aria-label="Show Less"
                        color="primary"
                      ></ExpandLess>}
                    <Typography color="primary">
                      Show {expanded ? "Less" : "More"}
                    </Typography>
                  </Stack>
                </Box>
              }
            </Stack>
          </RequestWrapper>
        }
      </CardContent>
    </Card>
  );
}