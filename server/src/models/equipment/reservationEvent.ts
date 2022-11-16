enum ReservationEventType {
    "COMMENT",
    "ASSIGNMENT",
    "CONFIRMATION",
    "CANCELLATION"
}

export interface ReservationEvent {
    id: string;
    eventType: ReservationEventType;
    reservationID: string,
    userID: string;
    dateTime: Date;
    payload: string;
}