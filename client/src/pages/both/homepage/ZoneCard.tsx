import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ZoneCardProps {
    id: number;
    name: string;
    hours: {type: string, dayOfTheWeek: number, time: string}[];
    imageUrl: string;
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

function dayOfTheWeekConvert(day: number) {
    switch (Number(day)) {
        case 1: return "Sunday";
        case 2: return "Monday";
        case 3: return "Tuesday";
        case 4: return "Wednesday";
        case 5: return "Thursday";
        case 6: return "Friday";
        case 7: return "Saturday";
        default: return "UNKNOWN";
    }
}

function addHours(date: Date, hours: number) {
    const msToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + msToAdd);
    return date;
}

function currentStatus(closing: string) {
    if (closing === "") {
        return <Typography color="red">CLOSED</Typography>;
    }
    const date = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/New_York",
        hour12: false
    })

    console.log(formatter.resolvedOptions().timeZone)

    var curTimeDate = new Date(Date.parse('01/01/2011 ' + formatter.format(date)));
    var closingDate = new Date(Date.parse('01/01/2011 ' + closing));

    if (curTimeDate > closingDate) {
        return <Typography color="red" fontWeight="bold">CLOSED</Typography>;
    } else if (addHours(curTimeDate, 1) > closingDate) {
        return <Typography color="#F9CA24" fontWeight="bold">CLOSING SOON</Typography>;
    } else {
        return <Typography color="green" fontWeight="bold">OPEN</Typography>;
    }
}

function getHoursToday(times: {type: string, dayOfTheWeek: number, time: string}[]) {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'America/New_York'
    });
    var today = formatter.format(date);
    var rawOpen = "";
    var rawClose = "";

    times.map((time: {type: string, dayOfTheWeek: number, time: string}, index) => {
        if (dayOfTheWeekConvert(time.dayOfTheWeek) === today && time.type === "OPEN") {
            rawOpen = time.time;
        }

        if (dayOfTheWeekConvert(time.dayOfTheWeek) === today && time.type === "CLOSE") {
            rawClose = time.time;
        }
        
    })

    return (
        <Stack justifyContent="space-between" direction="row">
            {currentStatus(rawClose)}
            <Stack direction="row">
                <Typography color="darkorange">{today}</Typography>
                <Typography paddingLeft={"10px"}>{rawOpen !== "" ? rawClose !== "" ? `${reformatTime(rawOpen)} - ${reformatTime(rawClose)}` : "" : ""}</Typography>
            </Stack>
            
        </Stack>
    )
}

export default function ZoneCard(props: ZoneCardProps) {

    const navigate = useNavigate();

    return (
        <Card sx={{width: props.isMobile ? "350px" : "500px"}}>
            <CardActionArea onClick={() => {navigate(`/makerspace/${props.id}`)}}>
                <CardMedia
                    component="img"
                    height="200px"
                    image={props.imageUrl}
                />
                <CardContent>
                    <Typography variant="h4">{props.name}</Typography>
                    {getHoursToday(props.hours)}
                </CardContent>
            </CardActionArea>
        </Card>
    );
} 