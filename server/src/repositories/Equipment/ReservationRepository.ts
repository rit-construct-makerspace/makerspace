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
  createReservation(reservation: ReservationInput): Promise<Reservation | null>;
  assignLabbieToReservation(resId: number, labbieId: number): Promise<Reservation | null>;
  removeLabbieFromReservation(resId: number): Promise<Reservation | null>;
  addComment(resId: number, authorId: number, commentText: string): Promise<string | null>;
  confirmReservation(resId: number): Promise<Reservation | null>;
  updateReservation(id: number, reservation: ReservationInput): Promise<Reservation | null>;
  cancelReservation(resId: number): Promise<Reservation | null>;
  archiveReservation(id: number): Promise<void>;
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
        "creator",
        "labbie",
        "maker",
        "createDate",
        "startTime",
        "endTime",
        "equipment",
        "status",
        "lastUpdated"
        )
      .from("Reservations")
      .where("id", id);

    return singleReservationToDomain(knexResult);
  }

    public async getReservations(): Promise<Reservation[]> {
      const knexResult = await this.queryBuilder("Reservations").select(
        "id",
        "creator",
        "labbie",
        "maker",
        "createDate",
        "startTime",
        "endTime",
        "equipment",
        "status",
        "lastUpdated"
      );
      return reservationsToDomain(knexResult);
    }

    public async updateReservation(id: number, reservation: ReservationInput): Promise<Reservation | null> {
        await this.queryBuilder("Reservations")
        .where("id", id)
        .update({
          creator: reservation.creator,
          labbie: reservation.labbie,
          maker: reservation.maker,
          equipment: reservation.equipment,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          startingMakerComment: reservation.startingMakerComment
        });
        return this.getReservationById(id);
    }

    public async createReservation(reservation: ReservationInput): Promise<Reservation | null> {
      // get all modules needed for the equipment
      const modules = (
        await this.queryBuilder("ModulesForEquipment")
        .select("trainingModuleId")
        .where("equipmentId", reservation.equipment)
      );
      let passed = true;
      // get last submission from maker for every module
      modules.forEach(async (module: any) => {
        const eligibility = await this.queryBuilder("ModuleSubmissions")
          .select("passed")
          .where("moduleID", module.id)
          .where("makerID", reservation.maker)
          .orderBy("submissionDate", "desc")
          .limit(1)
          .first();
        if (!eligibility) {
          passed = false;
        }
      });
      // in progress
      // const startTime = reservation.startTime;
      // const endTime
      // const free = await this.queryBuilder("Reservations")
      //   .select("*")
      //   .whereBetween("startTime", [reservation.startTime, reservation.endTime])
      //   .whereBetween("endTime", [reservation.startTime, reservation.endTime])
      // if maker has passed all modules 
      if (passed) {
        const newId = (
          await this.queryBuilder("Reservations").insert(
            {
              creator: reservation.creator,
              labbie: reservation.labbie,
              maker: reservation.maker,
              equipment: reservation.equipment,
              startTime: reservation.startTime,
              endTime: reservation.endTime,
              startingMakerComment: reservation.startingMakerComment
            },
            "id"
          )
        )[0];
        return singleReservationToDomain(this.getReservationById(newId));
      } else {
        // idk if this is the right thing to do
        return null;
      }
    }

  public async assignLabbieToReservation(resId: number, labbieId: number): Promise<Reservation | null> {
    await this.queryBuilder("Reservations")
      .where("id", resId)
      .update({labbie: labbieId});
    return singleReservationToDomain(this.getReservationById(resId));
  }

  public async removeLabbieFromReservation(resId: number): Promise<Reservation | null> {
    await this.queryBuilder("Reservations")
      .where("id", resId)
      .update({labbie: null});
    return singleReservationToDomain(this.getReservationById(resId));
  }

  public async addComment(resId: number, authorId: number, commentText: string): 
  Promise<string | null> {
    const newId = (
      await this.queryBuilder("ReservationEvents").insert(
        {
          eventType: "COMMENT",
          reservationId: resId,
          user: authorId,
          payload: commentText
        },
        "id"
      )
    )[0];
    
    // return last added comment
    return knex("Reservations")
    .join(
      "ReservationEvents",
      "Reservations.id",
      "=",
      "ReservationEvents.reservationId"
    )
    .select("ReservationEvents.payload")
    .where("Reservations.id", resId)
    .orderBy("ReservationEvents.dateTime", "desc")
    .limit(1)
    .first();
  }

  public async confirmReservation(resId: number): Promise<Reservation | null> {
    await this.queryBuilder("Reservations")
    .where("id", resId)
    .update({status: "CONFIRMED"});
    return singleReservationToDomain(this.getReservationById(resId));
  }

  public async cancelReservation(resId: number): Promise<Reservation | null> {
    await this.queryBuilder("Reservations")
    .where("id", resId)
    .update({status: "CANCELLED"});
    // idk if cancelling and archiving should be different, or if setting a
    // cancelled status is necessary
    this.archiveReservation(resId);
    return singleReservationToDomain(this.getReservationById(resId));
  }

  public async archiveReservation(id: number): Promise<void> {
    await knex("Reservations").where({ id: id}).update({archived: true})
  }
}
