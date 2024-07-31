import {
    Card, Stack,
    Typography
} from "@mui/material";

export default function AccountBalanceCard() {
    return (
        <Card sx={{ width: 350, maxWidth: 500, height: 150, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <Typography variant="h4">Lab Hours (SUMMER)</Typography>
            <Stack direction={"row"} spacing={2}>
                <Typography color={"darkorange"} variant="h6">Monday - Friday</Typography>
                <Typography align={"right"} variant="h6">9:00am - 5:00pm</Typography>
            </Stack>
        </Card>
    );
}
