import { Stack, Typography } from "@mui/material";
import { FullZone } from "../../queries/zoneQueries";

interface ZoneHoursProps {
    hours: FullZone["hours"];
    isMobile: boolean;
}

function reformatTime(time: string) {
    const split = time.split(":");
    var hours = Number(split[0]);

    var suffix = " AM";
    //Hours in PM
    if (hours > 11) {
        suffix = " PM";
        hours = hours == 12 ? 12 : hours - 12
    }

    return "" + hours + ":" + split[1] + suffix;
}

function getOpen(hours: FullZone["hours"]) {
    const openTime = hours.find((time) => time.type === "OPEN");
    return openTime ? reformatTime(openTime.time) : "";
}

function getClose(hours: FullZone["hours"]) {
    const closeTime = hours.find((time) => time.type === "CLOSE");
    return closeTime ? reformatTime(closeTime.time) : ""
}

function makeHours(hours: FullZone["hours"]) {
    const open = getOpen(hours);
    const close = getClose(hours);
    if (open === "" || close === "") {
        return "CLOSED";
    }

    return `${open} - ${close}`;
}

export default function ZoneHours(props: ZoneHoursProps) {

    const sunday = props.hours.filter(
        (time) => time.dayOfTheWeek == 1
    );

    const monday = props.hours.filter(
        (time) => time.dayOfTheWeek == 2
    );

    const tuesday = props.hours.filter(
        (time) => time.dayOfTheWeek == 3
    );

    const wednsday = props.hours.filter(
        (time) => time.dayOfTheWeek == 4
    );
    
    const thursday = props.hours.filter(
        (time) => time.dayOfTheWeek == 5
    );
    
    const friday = props.hours.filter(
        (time) => time.dayOfTheWeek == 6
    );
    
    const saturday = props.hours.filter(
        (time) => time.dayOfTheWeek == 7
    );

    return (
        <Stack padding="10px 0px" direction={props.isMobile ? "column" : "row"} justifyContent={props.isMobile ? "center" : "space-around"}>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Sunday</Typography>
                <Typography variant="body2">{makeHours(sunday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Monday</Typography>
                <Typography variant="body2">{makeHours(monday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}> 
                <Typography color="darkorange" variant="h6">Tuesday</Typography>
                <Typography variant="body2">{makeHours(tuesday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Wednsday</Typography>
                <Typography variant="body2">{makeHours(wednsday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Thursday</Typography>
                <Typography variant="body2">{makeHours(thursday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Friday</Typography>
                <Typography variant="body2">{makeHours(friday)}</Typography>
            </Stack>
            <Stack alignItems="center" direction={props.isMobile ? "row" : "column"} justifyContent={props.isMobile ? "space-between" : undefined}>
                <Typography color="darkorange" variant="h6">Saturday</Typography>
                <Typography variant="body2">{makeHours(saturday)}</Typography>
            </Stack>
        </Stack>
    );
}