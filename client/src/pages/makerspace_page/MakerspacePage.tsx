import { useQuery } from "@apollo/client";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/getZones";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { ZoneDash } from "../both/homepage/ZoneDash";
import { useEffect, useState } from "react";
import ZoneHours from "./ZoneHours";
import Equipment from "../../types/Equipment";
import EquipmentCard from "../../common/EquipmentCard";

export default function MakerspacePage() {
    const { id } = useParams<{ id: string }>();

    const getZone = useQuery(GET_ZONE_BY_ID, {variables: {id: id}});

    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWindowWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = windowWidth <= 1100;

    return (
        <RequestWrapper2 result={getZone} render={(data) => {

            const fullZone: FullZone = data.zoneByID;

            return (
                <Stack spacing={"2"} padding="20px" divider={<Divider orientation="horizontal" flexItem/>}>
                    <Typography variant="h3" align="center">{fullZone.name}</Typography>
                    <ZoneHours hours={fullZone.hours} isMobile={isMobile} />
                    {fullZone.rooms.map((room) => (
                        <Stack padding={"0 0 20px 0"}>
                            <Typography variant="h4" sx={{padding: "15px"}}>{room.name}</Typography>
                            <Grid container spacing={3} justifyContent="center">
                                {room.equipment.map((equipment: Equipment) => (
                                    <Grid key={equipment.id} item>
                                        <EquipmentCard equipment={equipment} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    ))}
                </Stack>
            );
        }} />
    );
}