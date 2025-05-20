import { useQuery } from "@apollo/client";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/getZones";
import RequestWrapper2 from "../../common/RequestWrapper2";
import { useEffect, useState } from "react";
import ZoneHours from "./ZoneHours";
import RoomSection from "./RoomSection";
import { FullRoom } from "../../types/Room";
import SearchBar from "../../common/SearchBar";
import StaffBar from "./StaffBar";
import { useCurrentUser } from "../../common/CurrentUserProvider";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function MakerspacePage() {
    const { id } = useParams<{ id: string }>();

    const user = useCurrentUser();
    const navigate = useNavigate();

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
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} width="auto">
                        <Typography variant="h3" align="center">{fullZone.name}</Typography>
                        {
                            user.privilege === "STAFF"
                            ? <IconButton
                                onClick={() => {navigate("/admin/rooms")}}
                                sx={{color: "gray"}}
                            >
                                <EditIcon/>
                            </IconButton>
                            : null
                        }
                        
                    </Stack>
                    <ZoneHours hours={fullZone.hours} isMobile={isMobile}/>
                    <StaffBar isMobile={isMobile} zoneID={fullZone.id}/>
                    <Stack padding="10px" direction="row" spacing={2}>
                        <SearchBar
                            placeholder="Search Equipment"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                            onClear={() => setEquipmentSearch("")}
                        />
                        {
                            user.privilege === "STAFF"
                            ? <Button variant="contained" color="success" startIcon={<AddIcon/>} onClick={() => (navigate("/admin/equipment/new"))}>
                                Create New Equipment
                            </Button>
                            : null
                        }
                    </Stack>
                    {fullZone.rooms.map((room: FullRoom) => (
                        <RoomSection room={room} equipmentSearch={equipmentSearch} isMobile={isMobile} />
                    ))}
                </Stack>
            );
        }} />
    );
}