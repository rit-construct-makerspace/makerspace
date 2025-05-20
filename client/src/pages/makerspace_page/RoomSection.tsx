import { Grid, Stack, Typography } from "@mui/material";
import { FullRoom } from "../../types/Room";
import Equipment from "../../types/Equipment";
import EquipmentCard from "../../common/EquipmentCard";
import { useCurrentUser } from "../../common/CurrentUserProvider";
import { useState } from "react";


interface RoomSectionProps {
    room: FullRoom;
    equipmentSearch: string;
    isMobile: boolean;
}

export default function RoomSection(props: RoomSectionProps) {
    const user = useCurrentUser();
    const roomEquipment = props.room.equipment;
    const isPriviledged = user.privilege === "MENTOR" || user.privilege === "STAFF";
    const filteredEquipment = roomEquipment.filter((equipment: Equipment) => equipment.name.toLowerCase().includes(props.equipmentSearch.toLowerCase()))
    const sortedEquipment = filteredEquipment.sort((a, b) => (a.name.toLowerCase().localeCompare(b.name.toLowerCase())));

    const [manageEquipment, setManageEquipment] = useState(false);
    const [curEquipID, setCurEquipID] = useState(0);

    function handleOpen(id: number) {
        setCurEquipID(id);
        setManageEquipment(true);
    }

    function handleClose() {
        setManageEquipment(false);
    }

    return (
        <Stack padding={"0 0 20px 0"}>
            <Typography variant="h4" sx={{padding: "15px"}}>{props.room.name}</Typography>
            <Grid container spacing={3} justifyContent="center">
                {sortedEquipment.map((equipment: Equipment) => (
                    <Grid key={equipment.id} item>
                        <EquipmentCard equipment={equipment} isMobile={props.isMobile}/>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}