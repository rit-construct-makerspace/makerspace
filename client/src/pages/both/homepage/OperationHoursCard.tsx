import {
    Card, Stack,
    Typography
} from "@mui/material";

export default function OperationHoursCard() {
    return (
        <Card sx={{ width: 350, maxHeight: 150, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <Typography variant="h4">Lab Hours <Typography variant="h6">(Week of 8/25)</Typography></Typography>
            <Stack direction={"row"} spacing={2}>
                <Typography color={"darkorange"} variant="h6">Monday - Friday</Typography>
                <Typography align={"right"} variant="h6">9:00am - 5:00pm</Typography>
            </Stack>
            <Typography variant="body1">(Closed Monday 7/2 for Labor Day)</Typography>
        </Card>
    );
}
