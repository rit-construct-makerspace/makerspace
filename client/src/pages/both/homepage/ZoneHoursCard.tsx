import { useQuery } from "@apollo/client";
import {
    Box,
    Card, CardHeader, Stack,
    Tab,
    Table,
    TableCell,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { GET_ZONES_WITH_HOURS, ZoneWithHours } from "../../../queries/getZones";
import RequestWrapper from "../../../common/RequestWrapper";


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

interface ZoneHoursCardProps {
    hours: {
        type: string;
        dayOfTheWeek: number;
        time: string;
    }[],
    children?: ReactNode[]
}


export default function ZoneHoursCard({ hours, children }: ZoneHoursCardProps) {
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

    return (
        <Card sx={{ width: !isMobile ? "25%" : "100%", height: "min-content", padding: "1em", border: 1, borderColor: "lightgrey", flexGrow: 1, fontWeight: 'bold', borderRadius: 0, overflow: "hidden", mt: 15 }} >
            <CardHeader title="Hours" sx={{ pt: 0 }} />
            <div>
                <Box sx={{ p: 3 }}>
                    <Table>
                        {hours.map((hour: { type: string, dayOfTheWeek: number, time: string }, index) => (
                            hour.type === "OPEN" &&
                            <TableRow>
                                <TableCell sx={{ px: 0 }}><Typography color={"darkorange"} variant="h6">{dayOfTheWeekConvert(hour.dayOfTheWeek)}</Typography></TableCell>
                                <TableCell sx={{ px: 0 }}><Typography sx={{ ml: 2 }} variant="body2">
                                    {reformatTime(hour.time)} - {hours[index + 1] != null && hours[index + 1].type == "CLOSE" && <span>{reformatTime(hours[index + 1].time)}</span>}
                                </Typography></TableCell>
                            </TableRow>
                        ))}
                    </Table>

                    {children}
                </Box>
            </div>
        </Card>
    );
}
