export interface ReservationInput {
    makerID: number;
    equipmentID: number;
    startTime: Date;
    endTime: Date;
    startingMakerComment: string;
}