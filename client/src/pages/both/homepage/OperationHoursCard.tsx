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
import { useEffect, useState } from "react";
import { GET_ZONES_WITH_HOURS, ZoneWithHours } from "../../../queries/getZones";
import RequestWrapper from "../../../common/RequestWrapper";


interface HoursTabPanelProps {
    children?: React.ReactNode;
    hours: [{type: string, dayOfTheWeek: number, time: string}];
    index: number;
    value: number;
    title: string;
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
  
function HoursTabPanel(props: HoursTabPanelProps) {
    const { children, hours, value, index, title, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>
                {/* <Typography variant="h4">{title} Hours</Typography> */}
                <Table>
                {hours.map((hour: {type: string, dayOfTheWeek: number, time: string}, index) => (
                    hour.type === "OPEN" &&
                    <TableRow>
                        <TableCell sx={{px:0}}><Typography color={"darkorange"} variant="h6">{dayOfTheWeekConvert(hour.dayOfTheWeek)}</Typography></TableCell>
                        <TableCell sx={{px:0}}><Typography sx={{ml: 2}} variant="body2">
                            {reformatTime(hour.time)} - {hours[index+1] != null && hours[index+1].type == "CLOSE" && <span>{reformatTime(hours[index+1].time)}</span>}
                        </Typography></TableCell>
                    </TableRow>
                ))}
                </Table> 
                
                {children}
            </Box>}
        </div>
    );
}


export default function OperationHoursCard() {
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
    const isMobile = width <= 768;

    const getZonesResult = useQuery(GET_ZONES_WITH_HOURS);

    const [currentTab, setCurrentTab] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    var indexCount = 0;

    return (
        <RequestWrapper
        loading={getZonesResult.loading}
        error={getZonesResult.error}
        >
            <Card sx={{ minWidth: 250, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1, fontWeight: 'bold'  }} >
            <CardHeader title="Lab Hours" sx={{pt: 0}} />

                <Tabs value={currentTab} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile >
                    {getZonesResult.data?.zones.map((zone: ZoneWithHours) => (
                        <Tab label={zone.name} id={"simple-tab-" + zone.id} aria-controls={"simple-tab-panel-" + zone.id} />
                    ))}
                </Tabs>
                {getZonesResult.data?.zones.map((zone: ZoneWithHours) => (
                    <HoursTabPanel value={currentTab} index={indexCount++} title={zone.name} hours={zone.hours}></HoursTabPanel>
                ))}
            </Card>
        </RequestWrapper>
    );
}
