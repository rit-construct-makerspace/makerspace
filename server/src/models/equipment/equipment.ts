import { EquipmentLabel } from "./equipmentLabel";

export interface Equipment {
    id: number;
    name: string;
    addedAt: Date,
    inUse: boolean;
    room_id: number;
}



