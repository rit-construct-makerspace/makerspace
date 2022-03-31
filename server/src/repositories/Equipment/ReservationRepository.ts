import { knex } from "../../db";
import { Reservation } from "../../models/equipment/reservation";
import { ReservationInput } from "../../models/equipment/reservationInput";
import {
  reservationsToDomain,
  singleReservationToDomain,
} from "../../mappers/equipment/Reservation";
import { getEquipmentByID } from "./EquipmentRepository";

export interface IReservationRepository {
  getReservationById(id: number | string): Promise<Reservation | null>;
  getReservations(): Promise<Reservation[]>;
  addReservation(reservation: ReservationInput): Promise<Reservation | null>;
  updateReservation(
    id: number,
    reservation: ReservationInput
  ): Promise<Reservation | null>;
  archiveReservation(id: number): Promise<Reservation | null>;
}

export class ReservationRepository implements IReservationRepository {
  private queryBuilder;

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex;
  }

  public async getReservationById(
    id: string | number
  ): Promise<Reservation | null> {
    const knexResult = await this.queryBuilder
      .first(
        "id",
        "userId",
        "supervisorId",
        "machineId",
        "createdAt",
        "startTime",
        "endTime"
      )
      .from("Reservations")
      .where("id", id);

    return singleReservationToDomain(knexResult);
  }

  public async getReservations(): Promise<Reservation[]> {
    const knexResult = await this.queryBuilder("Reservations").select(
      "id",
      "userId",
      "supervisorId",
      "machineId",
      "createdAt",
      "startTime",
      "endTime"
    );
    return reservationsToDomain(knexResult);
  }

  public async updateReservation(
    id: number,
    reservation: ReservationInput
  ): Promise<Reservation | null> {
    await this.queryBuilder("Reservations").where("id", id).update({
      userId: reservation.userId,
      supervisorId: reservation.supervisorId,
      machineId: reservation.machineId,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    });
    return this.getReservationById(id);
  }

  public async addReservation(
    reservation: ReservationInput
  ): Promise<Reservation | null> {
    const newId = (
      await this.queryBuilder("Reservations").insert(
        {
          userId: reservation.userId,
          supervisorId: reservation.supervisorId,
          machineId: reservation.machineId,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
        },
        "id"
      )
    )[0];
    return await this.getReservationById(newId);
  }

  public async archiveReservation(id: number): Promise<Reservation | null> {
    await knex("Reservations").where({ id: id }).update({ archived: true });
    return this.getReservationById(id);
  }
}
