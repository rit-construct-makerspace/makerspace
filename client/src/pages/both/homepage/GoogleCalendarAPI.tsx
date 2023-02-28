import { useState } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

interface CalendarEvent { // named CalendarEvent so we don't conflict with JS Event
  startDate: string;
  startTime: string;
  summary: string;
}

export default function UpcomingEventsCard() {
    const CALENDAR_ID = "";
    const [events, setEvents] = useState<CalendarEvent[]>([]); // replace with useQuery

    return (
        <Card sx={{ width: 350, padding: 2, border: 1, borderColor: "lightgrey" }}>
          <CardContent>
            <Stack direction="column" alignItems="flex-start" spacing={2} justifyContent="space-evenly">
              <Stack direction="column" alignItems="flex-start" spacing={0} justifyContent="space-evenly">
                <Typography variant="h4">Upcoming Events</Typography>
                <Button
                  sx={{ color: "darkorange" }}
                  href={`https://calendar.google.com/calendar/embed?src=${CALENDAR_ID}&ctz=America%2FNew_York`}
                  target="_blank"
                >
                  View Full Calendar
                </Button>
              </Stack>
              {events.length > 0 ? (
                events.map((event) => ( 
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={5}>
                    <Typography variant="h5">{event.startDate}</Typography>
                    <Stack direction="column" spacing={1}>
                      <Typography variant="h6">{event.startTime}</Typography>
                      <Typography variant={"h5"}>{event.summary}</Typography>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Typography variant="h5">No upcoming events found</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      );
      
    }