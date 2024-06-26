/** reservatioInputn.ts
 * Object Model for Reservations Inputs (maker submissions for reservation creation)
 */
export interface ReservationInput {
    makerID: number;
    equipmentID: number;
    startTime: Date;
    endTime: Date;
    startingMakerComment: string;
}