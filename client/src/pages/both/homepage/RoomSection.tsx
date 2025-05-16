import { Grid, Stack, Typography } from "@mui/material";
import { FullRoom } from "../../../types/Room";
import Equipment from "../../../types/Equipment";
import EquipmentCard from "../../../common/EquipmentCard";


interface RoomSectionProps {
    room: FullRoom;
    equipmentSearch: string;
    isMobile: boolean;
}

export default function RoomSection(props: RoomSectionProps) {

    const roomEuipment = props.room.equipment;

    const filteredEquipment = roomEuipment.filter((equipment: Equipment) => equipment.name.includes(props.equipmentSearch))

    return (
        <Stack padding={"0 0 20px 0"}>
            <Typography variant="h4" sx={{padding: "15px"}}>{props.room.name}</Typography>
            <Grid container spacing={3} justifyContent="center">
                {filteredEquipment.map((equipment: Equipment) => (
                    <Grid key={equipment.id} item>
                        <EquipmentCard equipment={equipment} isMobile={props.isMobile} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}