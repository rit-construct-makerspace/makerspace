import {
    Card, CardActionArea, Stack,
    Typography
} from "@mui/material";
import React from "react";
import { useQuery } from "@apollo/client";
import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";
import RequestWrapper from "../../../common/RequestWrapper";
import { grey } from "@mui/material/colors";

export default function AnnouncementsCard() {
    const getAnnouncementsResult = useQuery(GET_ANNOUNCEMENTS);

    return (
        <RequestWrapper
            loading={getAnnouncementsResult.loading}
            error={getAnnouncementsResult.error}
        >
            <Card elevation={2} sx={{ width: 350, minHeight: 355, padding: 2, justifyContent: "space-between", border: 1, borderColor: "lightgrey" }}>
                <Stack direction={"column"} spacing={1}>
                    <Typography variant="h4">Announcements</Typography>
                    <Stack spacing={1}>
                        {/* {getAnnouncementsResult.data?.announcements.map((announcement: Announcement) => (
                            <Stack>
                                <Typography variant="h5" color={"darkorange"}>{announcement.title}</Typography>
                                <Typography variant="body1">{announcement.description}</Typography>
                            </Stack>
                        ))} */}
                        <Typography variant={"h5"} style={{ color: "grey" }}>No announcements!</Typography>
                    </Stack>
                </Stack>
            </Card>
        </RequestWrapper>
    );
}

