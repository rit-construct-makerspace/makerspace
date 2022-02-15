export interface ReservationInput {
    userId: number;
    supervisorId: number;
    machineId: number;
    createdAt: Date;
    startTime: Date;
    endTime: Date;
}