enum ReservationEventType {
    "COMMENT",
    "ASSIGNMENT",
    "CONFIRMATION",
    "CANCELLATION"
}

export interface ReservationEvent {
    id: number;
    eventType: ReservationEventType;
    reservationID: number,
    userID: number;
    dateTime: Date;
    payload: string;
}