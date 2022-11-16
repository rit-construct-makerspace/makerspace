enum ReservationStatus {
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
}
export interface Reservation {
    id: string;
    makerID: string;
    createDate: Date;
    startTime: Date;
    endTime: Date;
    equipmentID: string;
    status: ReservationStatus;
    lastUpdated: Date;
}