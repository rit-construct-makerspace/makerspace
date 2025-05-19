import { useQuery } from "@apollo/client";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/getZones";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { useEffect, useState } from "react";
import ZoneHours from "./ZoneHours";
import RoomSection from "../both/homepage/RoomSection";
import { FullRoom } from "../../types/Room";
import SearchBar from "../../common/SearchBar";
import StaffBar from "./StaffBar";

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

    const [equipmentSearch, setEquipmentSearch] = useState("");

    return (
        <RequestWrapper2 result={getZone} render={(data) => {

            const fullZone: FullZone = data.zoneByID;

            return (
                <Stack spacing={"2"} padding="20px" divider={<Divider orientation="horizontal" flexItem/>}>
                    <Typography variant="h3" align="center">{fullZone.name}</Typography>
                    <ZoneHours hours={fullZone.hours} isMobile={isMobile}/>
                    <StaffBar isMobile={isMobile} zoneID={fullZone.id}/>
                    <Box padding="10px">
                        <SearchBar
                            placeholder="Search Equipment"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                        />
                    </Box>
                    {fullZone.rooms.map((room: FullRoom) => (
                        <RoomSection room={room} equipmentSearch={equipmentSearch} isMobile={isMobile} />
                    ))}
                </Stack>
            );
        }} />
    );
}