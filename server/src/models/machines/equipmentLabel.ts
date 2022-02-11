import { Module } from "../training/module";

export interface EquipmentLabel {
    id: number;
    name: string;
    trainingModules:[Module];
}



