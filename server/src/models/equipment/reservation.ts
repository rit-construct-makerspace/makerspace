import { ReservationEvent } from "./reservationEvent";

enum ReservationStatus {
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
}
export interface Reservation {
    id: number;
    creator: number;
    maker: number;
    labbie: number;
    createDate: Date;
    startTime: Date;
    endTime: Date;
    equipment: number;
    status: ReservationStatus;
    createdAt: Date;
    lastUpdated: Date;
    independent: boolean;
}