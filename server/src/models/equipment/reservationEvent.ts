enum ReservationEventType {
    "COMMENT",
    "ASSIGNMENT",
    "CONFIRMATION",
    "CANCELLATION"
}

export interface ReservationEvent {
    id: number;
    reservationId: number,
    eventType: ReservationEventType;
    user: number;
    dateTime: Date;
    payload: string;
}