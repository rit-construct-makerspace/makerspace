import { ObjectSummary } from "./Common";

export default interface Equipment {
  id: number;
  name: string;
  imageUrl?: string;
  sopUrl: string;
  trainingModules: any;
  numAvailable: number;
  numInUse: number;
  byReservationOnly: boolean;
}

export interface EquipmentWithRoom {
  id: number;
  name: string;
  imageUrl?: string;
  sopUrl: string;
  trainingModules: any;
  numAvailable: number;
  numInUse: number;
  byReservationOnly: boolean;
  archived: boolean;
  notes: string;
  room: ObjectSummary;
}
