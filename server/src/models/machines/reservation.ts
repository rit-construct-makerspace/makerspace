export interface Reservation {
    id: number;
    userId: number;
    supervisorId: number;
    machineId: number;
    createdAt: Date;
    startTime: Date;
    endTime: Date;
}