/** CalendarEventsRepository.ts
 * DB operations endpoint for CalendarEvents table
 */

import path from 'path';
import { promises as fs } from 'fs';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { CalendarEvent } from '../../schemas/calendarEventsSchema.js';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar';

const TOKEN_PATH = "/gapi/token.json";
const CREDENTIALS_PATH = path.join('/gapi/credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CALENDAR_ID = "c_1d2032584bf3324558da28ace1d5d1e522e3fca2de4e578589a31e4477fa522e@group.calendar.google.com";

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(path.join("../..", TOKEN_PATH), "utf8");
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
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client:any) {
    const content = await fs.readFile(path.join("../.." ,CREDENTIALS_PATH), "utf8");
    const keys = JSON.parse(content);
    const key = keys.installed;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload, "utf8");
}

/**
 * Load or request or authorization to call APIs.
 * @returns {Promise} json client object
 */
async function authorize() {
    const jsonClient = await loadSavedCredentialsIfExist();
    if (jsonClient) {
        return jsonClient;
    }
    const oauth2Client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (oauth2Client.credentials) {
        await saveCredentials(jsonClient);
    }
    return jsonClient;
}

/**
 * Fromats array of GoogleAuth.fromJSON calendar events as table entries
 * @param events GoogleAuth JSON events
 * @returns Array of table formatted Events
 */
function formatCalendarEvents(events: calendar_v3.Schema$Event[] | undefined): CalendarEvent[] {
    if (events === undefined) {
        return [];
    }
    return events.map<CalendarEvent>(event => {
        return {
            id: event.id,
            summary: event.summary,
            description: event.description,
            location: event.location,
            startTime: event.start?.dateTime,
            endTime: event.start?.dateTime,
            timeZone: event.start?.timeZone
        }
    });
}

/**
 * 
 * @param timeMin earliest possible time to filter by
 * @param maxResults max number of events starting from timeMin to retrieve
 * @returns {CalendarEvent[]} filtered events
 */
export async function getUpcomingEvents(timeMin: string, maxResults: number): Promise<CalendarEvent[]> {
    let auth: any;
    try {
        auth = await authorize();
    }
    catch (err) {
        // handle error
    }
    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: timeMin,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
    });

    const event_response = res.data.items;
    return formatCalendarEvents(event_response);
};