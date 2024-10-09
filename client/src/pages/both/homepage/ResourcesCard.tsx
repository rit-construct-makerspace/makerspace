import {
    Card, CardHeader, Stack,
    Typography
} from "@mui/material";

export default function ResourcesCard() {
    return (
        <Card sx={{ minWidth: 250, maxWidth: 400, maxHeight: 175, padding: 2, border: 1, borderColor: "lightgrey", flexGrow: 1  }} >
            <CardHeader title="Required Lab Training" sx={{pt: 0, fontWeight: 'bold'}} />
            <Stack direction={"column"} spacing={1}>
                <Typography variant="body1">All Makerspace users must complete the <a href="https://rit.sabacloud.com/Saba/Web_spf/NA3P1PRD0049/common/leclassview/dowbt-0000146117">Shop Safety training course</a> before using any equipment.</Typography>
            </Stack>
        </Card>
    );
}
