import React, { useEffect, useState } from "react";
import { Alert, Box, Card, CardHeader, Collapse, Grid, IconButton, Stack, Tab, Tabs } from "@mui/material";
import Page from "../../Page";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import Typography from "@mui/material/Typography";
import AccountBalanceCard from "./AccountBalanceCard";
import OperationHoursCard from "./OperationHoursCard";
import UpcomingEventsCard from "./UpcomingEventsCard";
import IncompleteTrainingsCard from "./IncompleteTrainingsCard";
import ExpiringSoonCard from "./ExpiringSoonCard";
import AnnouncementsCard from "./AnnouncementsCard";
import { useNavigate } from "react-router-dom";
import { wrap } from "module";
import ResourcesCard from "./ResourcesCard";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { FullZone, GET_ZONES_WITH_HOURS } from "../../../queries/getZones";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PageSectionHeader from "../../../common/PageSectionHeader";
import EquipmentCard from "../equipment/EquipmentCard";
import ZoneHoursCard from "./ZoneHoursCard";
import EquipmentModal from "../../maker/equipment_modal/EquipmentModal";
import UnpagedEquipmentModal from "../../maker/equipment_modal/UnpagedEquipmentModal";
import UnpagedEquipmentCard from "../equipment/UnpagedEquipmentCard";

const INCREMENT_SITE_VISITS = gql`
    query IncrementSiteVisits {
        incrementSiteVisits
    }
`;

export function ZoneDash({ zone, open }: { zone: FullZone, open: boolean }) {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();

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

    const [equipmentModalID, setEquipmentModalID] = useState<number | undefined>(undefined);

    if (!open) return (<></>);

    return (
        <Box>
            <Stack direction={isMobile ? "column-reverse" : "row"} alignItems={isMobile ? "center" : undefined}>
                <Box width={"75%"}>
                    {zone.rooms.map((room) => (
                        <Box>
                            <PageSectionHeader>{room.name}</PageSectionHeader>

                            <Grid container spacing={3}>
                                {room.equipment.map((equipment) => (
                                    <Grid key={equipment.id} item>
                                        <UnpagedEquipmentCard id={equipment.id} name={equipment.name} setID={setEquipmentModalID} sopUrl={equipment.sopUrl} trainingModules={equipment.trainingModules} numAvailable={equipment.numAvailable} numUnavailable={equipment.numInUse} byReservationOnly={equipment.byReservationOnly}
                                            imageUrl={(equipment.imageUrl == undefined || equipment.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + equipment.imageUrl)} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Box>
                {!isMobile && <ZoneHoursCard hours={zone.hours}></ZoneHoursCard>}
            </Stack>


            <UnpagedEquipmentModal equipmentID={equipmentModalID} setEquipmentID={setEquipmentModalID} />
        </Box>
    );
};

