import { Reservation } from "../../models/equipment/reservation";

export function reservationsToDomain(raw: any): Reservation[] {
  return raw.map((i: any) => singleReservationToDomain(i));

}

export function singleReservationToDomain(raw: any): Reservation | null {
  if (raw === undefined || raw === null) return null;
  const value: Reservation = {
    id: raw.id,
    userId: raw.userId,
    supervisorId: raw.supervisorId,
    machineId: raw.machineId,
    createdAt: raw.createdAt,
    startTime: raw.startTime,
    endTime: raw.endTime
  }
  return value;
}