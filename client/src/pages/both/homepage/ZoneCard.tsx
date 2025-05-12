import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";

interface ZoneCardProps {
    id: number;
    name: string;
    hours: {type: string, dayOfTheWeek: number, time: string}[];
    imageUrl: string; 
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

function getHoursToday(times: {type: string, dayOfTheWeek: number, time: string}[]) {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'America/New_York'
    });
    var today = formatter.format(date);
    var open = "";
    var close = "";

    times.map((time: {type: string, dayOfTheWeek: number, time: string}, index) => {
        if (dayOfTheWeekConvert(time.dayOfTheWeek) === today && time.type === "OPEN") {
            open = reformatTime(time.time);
        }

        if (dayOfTheWeekConvert(time.dayOfTheWeek) === today && time.type === "CLOSE") {
            close = reformatTime(time.time);
        }
        
    })

    return (
        <Stack justifyContent="space-between" direction="row">
            <Typography color="darkorange">{today}</Typography>
            <Typography>{open !== "" ? close !== "" ? `${open} - ${close}` : "CLOSED" : "CLOSED"}</Typography>
        </Stack>
    )
}

export default function ZoneCard(props: ZoneCardProps) {

    return (
        <Card sx={{minWidth: "500px"}}>
            <CardActionArea>
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