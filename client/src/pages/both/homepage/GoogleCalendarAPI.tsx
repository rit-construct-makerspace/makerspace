import { useEffect, useState } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";


const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const CALENDAR_ID = "c_1d2032584bf3324558da28ace1d5d1e522e3fca2de4e578589a31e4477fa522e@group.calendar.google.com";
const credentials_content = {"installed":{"client_id":"939175327336-mlaepn29udrcg716qdpvv9qr9g0cv8j1.apps.googleusercontent.com","project_id":"construct-calendar-377322","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost"]}};

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
//const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

declare global {
    interface Window {
        gapi: any;
    }
}

interface Event {
    startDate: string;
    startTime: string;
    summary: string;
  }

export default function UpcomingEventsCard() {
    const [events, setEvents] = useState<Event[]>([]);

        /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
      try {
        //const content = await fs.readFile(TOKEN_PATH);
        //const content = require('json!./token.json');
        const content = sessionStorage.getItem("googletoken");
        if (content == null) {
          throw(new Error("Token is null"));
        }
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
      } catch (err) {
        return null;
      }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client:any) {
      //const content = await fs.readFile(CREDENTIALS_PATH);
      const keys = credentials_content;
      const key = keys.installed;
      const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      });
      //await fs.writeFile(TOKEN_PATH, payload);
      sessionStorage.setItem("googletoken", payload);
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async function authorize() {
      let client = await loadSavedCredentialsIfExist();
      if (client) {
        return client;
      }
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      if (client.credentials) {
        await saveCredentials(client);
      }
      return client;
    }

    const getUpcomingEvents = async(auth:any) => {
      const calendar = google.calendar({version: 'v3', auth});
      const res = await calendar.events.list({
        calendarId: 'c_1d2032584bf3324558da28ace1d5d1e522e3fca2de4e578589a31e4477fa522e@group.calendar.google.com',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const event_response = res.data.items;
      setEvents(event_response);
    };

    useEffect(() => {
        authorize().then(getUpcomingEvents).catch(console.error);
    }, []);

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