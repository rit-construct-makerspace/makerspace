import {
    Box,
    Card,
    CardHeader,
    Collapse,
    Stack,
    SxProps,
    Typography
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { Announcement, GET_ANNOUNCEMENTS } from "../../../queries/announcementsQueries";
import RequestWrapper from "../../../common/RequestWrapper";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from '@mui/icons-material/ExpandLess';

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

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const desktopStyle: SxProps = { minWidth: 250, maxWidth: 400, maxHeight: 1000, padding: "1em", justifyContent: "space-between", border: 1, borderColor: "lightgrey", flexGrow: 1, overflowY: "scroll", borderRadius: 0 };
    const mobileStyle: SxProps = { height: 'auto', padding: "1em", justifyContent: "space-between", border: 1, borderColor: "lightgrey", flexGrow: 1, overflowY: "hidden", borderRadius: 0 };


    return (
        <RequestWrapper
            loading={getAnnouncementsResult.loading}
            error={getAnnouncementsResult.error}
        >
            <Card elevation={2} sx={isMobile ? mobileStyle : desktopStyle}>
                {isMobile
                    ? <Stack direction={"column"} spacing={1}>
                        <CardHeader title="Announcements" sx={{ pt: 0, fontWeight: 'bold' }} />
                        <Stack spacing={1}>
                            {getAnnouncementsResult.data?.getAllAnnouncements?.slice(0, Math.min(2, getAnnouncementsResult.data?.getAllAnnouncements?.length))
                                .map((announcement: Announcement) => (
                                    <Stack>
                                        <Typography variant="h5" color={"darkorange"}>{announcement.title}</Typography>
                                        <Typography variant="body1"><Markdown>{announcement.description}</Markdown></Typography>
                                    </Stack>
                                ))}
                            {!getAnnouncementsResult.data?.getAllAnnouncements && (
                                <Typography variant={"h5"} style={{ color: "grey" }}>No announcements!</Typography>
                            )}

                            {getAnnouncementsResult.data?.getAllAnnouncements?.length > 2 &&
                                <Box>
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        {getAnnouncementsResult.data?.getAllAnnouncements?.slice(2, getAnnouncementsResult.data?.getAllAnnouncements?.length)
                                            .map((announcement: Announcement) => (
                                                <Stack>
                                                    <Typography variant="h5" color={"darkorange"}>{announcement.title}</Typography>
                                                    <Typography variant="body1"><Markdown>{announcement.description}</Markdown></Typography>
                                                </Stack>
                                            ))}
                                    </Collapse>
                                    <Stack direction={"row"} onClick={handleExpandClick}>
                                        {!expanded ? <ExpandMore
                                            aria-expanded={expanded}
                                            aria-label="Show More"
                                            color="primary"
                                        ></ExpandMore>
                                            : <ExpandLess
                                                aria-expanded={expanded}
                                                aria-label="Show Less"
                                                color="primary"
                                            ></ExpandLess>}
                                        <Typography color="primary">
                                            Show {expanded ? "Less" : "More"}
                                        </Typography>
                                    </Stack>
                                </Box>
                            }
                        </Stack>
                    </Stack>
                    : <Stack direction={"column"} spacing={1}>
                        <CardHeader title="Announcements" sx={{ pt: 0, fontWeight: 'bold' }} />
                        <Stack spacing={1}>
                            {getAnnouncementsResult.data?.getAllAnnouncements?.map((announcement: Announcement) => (
                                <Stack>
                                    <Typography variant="h5" color={"darkorange"}>{announcement.title}</Typography>
                                    <Typography variant="body1"><Markdown>{announcement.description}</Markdown></Typography>
                                </Stack>
                            ))}
                            {!getAnnouncementsResult.data?.getAllAnnouncements && (
                                <Typography variant={"h5"} style={{ color: "grey" }}>No announcements!</Typography>
                            )}
                        </Stack>
                    </Stack>
                }
            </Card>
        </RequestWrapper>
    );
}

