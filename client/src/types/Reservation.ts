import User from "./User";
import Equipment from "./Equipment";

export enum ReservationStatus {
  "PENDING",
  "CONFIRMED",
  "CANCELLED"
}
export interface ReservationAttachment {
  name: string;
  url: string;
}

export interface ReservationInput {
  makerID: number
  expertID: number
  equipmentID: number
  startTime: Date
  endTime: Date
}

export default interface Reservation {
  id: number;
  maker: User;
  equipment: Equipment;
  startTime: string;
  endTime: string;
  comment: string;
  attachments: ReservationAttachment[];
  status: string;
}
