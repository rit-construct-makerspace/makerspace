import {
    Card,
    CardHeader,
    Stack,
    Typography
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/announcementsQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";

export default function AnnouncementsCard() {
    const getAnnouncementsResult = useQuery(GET_ANNOUNCEMENTS);

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
        <RequestWrapper
            loading={getAnnouncementsResult.loading}
            error={getAnnouncementsResult.error}
        >
            <Card elevation={2} sx={{ minWidth: 250, maxWidth: 400, height: 500, padding: "1em", justifyContent: "space-between", border: 1, borderColor: "lightgrey", flexGrow: 1, overflowY: "scroll", borderRadius: 0  }}>
                <Stack direction={"column"} spacing={1}>
                    <CardHeader title="Announcements" sx={{pt: 0, fontWeight: 'bold'}} />
                    <Stack spacing={1}>
                        {getAnnouncementsResult.data?.getAllAnnouncements?.map((announcement: Announcement) => (
                            <Stack>
                                <Typography variant="h5" color={"darkorange"}>{announcement.title}</Typography>
                                <Typography variant="body1"><Markdown>{announcement.description}</Markdown></Typography>
                            </Stack>
                        ))}
                        {!getAnnouncementsResult.data?.getAllAnnouncements &&(
                            <Typography variant={"h5"} style={{ color: "grey" }}>No announcements!</Typography>
                        )}
                    </Stack>
                </Stack>
            </Card>
        </RequestWrapper>
    );
}

