import {
    Card, Stack,
    Typography
} from "@mui/material";

export default function AccountBalanceCard() {
    return (
        <Card sx={{ width: 350, maxWidth: 500, height: 150, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <Typography variant="h4">Lab Hours</Typography>
            <Stack direction={"row"} spacing={2}>
                <Typography color={"darkorange"} variant="h6">Monday - Thursday</Typography>
                <Typography align={"right"} variant="h6">9:00am - 9:00pm</Typography>
            </Stack>

            <Stack direction={"row"} spacing={2}>
                <Typography color={"darkorange"} variant="h6">Friday</Typography>
                <Typography align={"right"} variant="h6">9:00am - 6:00pm</Typography>
            </Stack>

            <Stack direction={"row"} spacing={2}>
                <Typography color={"darkorange"} variant="h6">Saturday - Sunday</Typography>
                <Typography align={"right"} variant="h6">1:00pm - 5:00pm*</Typography>
            </Stack>
        </Card>
    );
}
