import { EquipmentLabel } from "./equipmentLabel";

export interface Equipment {
    id: number;
    name: string;
    room: string;
    equipmentLabels: [EquipmentLabel];
    addedAt: Date,
    inUse: boolean;
}



