import { EquipmentLabel } from "./equipmentLabel";

export interface Equipment {
    id: number;
    name: string;
    room: string;
    addedAt: Date,
    inUse: boolean;
}



