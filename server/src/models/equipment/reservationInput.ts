export interface ReservationInput {
    makerID: string;
    equipmentID: string;
    startTime: Date;
    endTime: Date;
    startingMakerComment: string;
}