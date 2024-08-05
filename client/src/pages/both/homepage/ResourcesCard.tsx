import {
    Card, Stack,
    Typography
} from "@mui/material";

export default function ResourcesCard() {
    return (
        <Card sx={{ width: 350, maxHeight: 125, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <Typography variant="h4">Required Lab Training</Typography>
            <Stack direction={"column"} spacing={1}>
                <Typography color={"black"} variant="body1">All Makerspace users must complete the <a href="https://rit.sabacloud.com/Saba/Web_spf/NA3P1PRD0049/common/leclassview/dowbt-0000146117">Shop Safety training course</a> before using any equipment.</Typography>
            </Stack>
        </Card>
    );
}
