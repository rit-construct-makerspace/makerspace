import { useQuery } from "@apollo/client";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FullZone, GET_ZONE_BY_ID } from "../../queries/zoneQueries";
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
import { useIsMobile } from "../../common/IsMobileProvider";
import { isManagerFor, isStaffFor } from "../../common/PrivilegeUtils";

export default function MakerspacePage() {
    const { makerspaceID } = useParams<{ makerspaceID: string }>();

    const user = useCurrentUser();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const getZone = useQuery(GET_ZONE_BY_ID, {variables: {id: makerspaceID}});

    const [equipmentSearch, setEquipmentSearch] = useState("");

    const staffMode = isStaffFor(user, Number(makerspaceID))

    return (
        <RequestWrapper2 result={getZone} render={(data) => {

            const fullZone: FullZone = data.zoneByID;

            return (
                <Stack spacing={"2"} padding="20px" divider={<Divider orientation="horizontal" flexItem/>}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} width="auto">
                        <Typography variant="h3" align="center">{fullZone.name}</Typography>
                        {
                            isManagerFor(user, Number(makerspaceID))
                            ? <IconButton
                                onClick={() => {navigate(`/makerspace/${makerspaceID}/edit`)}}
                                sx={{color: "gray"}}
                            >
                                <EditIcon/>
                            </IconButton>
                            : null
                        }
                        
                    </Stack>
                    <ZoneHours hours={fullZone.hours} isMobile={isMobile}/>
                    <StaffBar/>
                    <Stack padding="10px" direction="row" spacing={2}>
                        <SearchBar
                            placeholder="Search Equipment"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                            onClear={() => setEquipmentSearch("")}
                        />
                        {
                            isManagerFor(user, Number(makerspaceID))
                            ? <Button variant="contained" color="success" startIcon={<AddIcon/>} onClick={() => (navigate("/admin/equipment/new"))}>
                                Create New Equipment
                            </Button>
                            : null
                        }
                    </Stack>
                    {fullZone.rooms.map((room: FullRoom) => (
                        <RoomSection room={room} equipmentSearch={equipmentSearch} isMobile={isMobile} staffMode={staffMode} />
                    ))}
                </Stack>
            );
        }} />
    );
}