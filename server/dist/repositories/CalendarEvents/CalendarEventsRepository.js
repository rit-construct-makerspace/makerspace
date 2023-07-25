"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingEvents = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const local_auth_1 = require("@google-cloud/local-auth");
const googleapis_1 = require("googleapis");
const TOKEN_PATH = "/gapi/token.json";
const CREDENTIALS_PATH = path_1.default.join('/gapi/credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CALENDAR_ID = "c_1d2032584bf3324558da28ace1d5d1e522e3fca2de4e578589a31e4477fa522e@group.calendar.google.com";
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs_1.promises.readFile(path_1.default.join("../..", TOKEN_PATH), "utf8");
            if (content == null) {
                throw (new Error("Token is null"));
            }
            const credentials = JSON.parse(content);
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            return null;
        }
    });
}
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs_1.promises.readFile(path_1.default.join("../..", CREDENTIALS_PATH), "utf8");
        const keys = JSON.parse(content);
        const key = keys.installed;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        yield fs_1.promises.writeFile(TOKEN_PATH, payload, "utf8");
    });
}
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonClient = yield loadSavedCredentialsIfExist();
        if (jsonClient) {
            return jsonClient;
        }
        const oauth2Client = yield (0, local_auth_1.authenticate)({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (oauth2Client.credentials) {
            yield saveCredentials(jsonClient);
        }
        return jsonClient;
    });
}
function formatCalendarEvents(events) {
    if (events === undefined) {
        return [];
    }
    return events.map(event => {
        var _a, _b, _c;
        return {
            id: event.id,
            summary: event.summary,
            description: event.description,
            location: event.location,
            startTime: (_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime,
            endTime: (_b = event.start) === null || _b === void 0 ? void 0 : _b.dateTime,
            timeZone: (_c = event.start) === null || _c === void 0 ? void 0 : _c.timeZone
        };
    });
}
function getUpcomingEvents(timeMin, maxResults) {
    return __awaiter(this, void 0, void 0, function* () {
        let auth;
        try {
            auth = yield authorize();
        }
        catch (err) {
        }
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth });
        const res = yield calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: timeMin,
            maxResults: maxResults,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const event_response = res.data.items;
        return formatCalendarEvents(event_response);
    });
}
exports.getUpcomingEvents = getUpcomingEvents;
;
//# sourceMappingURL=CalendarEventsRepository.js.map