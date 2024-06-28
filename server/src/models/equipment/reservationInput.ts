/** reservatioInputn.ts
 * Object Model for Reservations Inputs (maker submissions for reservation creation)
 */
export interface ReservationInput {
    makerID: number;
    expertID: number;
    equipmentID: number;
    startTime: string;
    endTime: string;
    startingMakerComment: string;
}