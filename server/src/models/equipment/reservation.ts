import { ReservationEvent } from "./reservationEvent";

enum ReservationStatus {
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
}
export interface Reservation {
    id: number;
    makerID: number;
    createDate: Date;
    startTime: Date;
    endTime: Date;
    equipmentID: number;
    status: ReservationStatus;
    lastUpdated: Date;
    independent: boolean;
}