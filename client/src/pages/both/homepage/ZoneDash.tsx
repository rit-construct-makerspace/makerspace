import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { FullZone } from "../../../queries/getZones";
import PageSectionHeader from "../../../common/PageSectionHeader";
import ZoneHoursCard from "./ZoneHoursCard";
import UnpagedEquipmentModal from "../../maker/equipment_modal/UnpagedEquipmentModal";
import UnpagedEquipmentCard from "../equipment/UnpagedEquipmentCard";
import Equipment from "../../../types/Equipment";
import EquipmentCard from "../../../common/EquipmentCard";

const INCREMENT_SITE_VISITS = gql`
    query IncrementSiteVisits {
        incrementSiteVisits
    }
`;

export function ZoneDash({ zone }: { zone: FullZone}) {
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

    return (
        <Box>
        </Box>
    );
};

