import {
    Card, Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";

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

    return (
        <Card sx={{ minWidth: 250, maxHeight: 250, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <Typography variant="h4">Lab Hours <Typography variant="h6">(Week of 8/25)</Typography></Typography>
            <Stack direction={"column"} spacing={0}>
                <Typography color={"darkorange"} variant="h6">Monday - Friday</Typography>
                <Typography sx={{ml: 2}} variant="h6">9:00am - 5:00pm</Typography>
            </Stack>
            <Typography variant="body1">(Closed Monday 7/2 for Labor Day)</Typography>
        </Card>
    );
}
