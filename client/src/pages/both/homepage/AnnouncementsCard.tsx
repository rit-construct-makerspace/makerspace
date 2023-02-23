import {
    Card, CardContent, Stack,
    Typography
} from "@mui/material";
import {useCurrentUser} from "../../../common/CurrentUserProvider";
import React from "react";

export default function AccountBalanceCard() {
    return (
        <Card sx={{ width: 350, height: 400, padding: 2, justifyContent: "space-between", border: 1, borderColor: "lightgrey" }} >
            <Stack direction={"column"} spacing={1}>
                <Typography variant="h4">Announcements</Typography>
                <Stack>
                    <Typography variant="h5" color={"darkorange"}>Big news, huge news</Typography>
                    <Typography variant="body1">I'm announcing something important, but I can't say what
                        it is. It's a secret. But I am announcing it. As an example.</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
