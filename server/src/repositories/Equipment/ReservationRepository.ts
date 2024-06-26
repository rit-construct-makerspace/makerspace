/** ReservationRepository.ts
 * DB operations endpoint for Equipment table
 */

import { knex } from "../../db";
import { ReservationInput } from "../../models/equipment/reservationInput";
import { EntityNotFound } from "../../EntityNotFound";
import { ReservationRow, ReservationEventRow } from "../../db/tables";

export interface IReservationRepository {
  getReservationById(id: number): Promise<ReservationRow>;
  getReservations(): Promise<ReservationRow[]>;
  createReservation(reservation: ReservationInput): Promise<ReservationRow>;
  addComment(resID: number, authorID: number, commentText: string): Promise<ReservationEventRow>;
  confirmReservation(resID: number): Promise<ReservationRow>;
  cancelReservation(resID: number): Promise<ReservationRow>;
}

export class ReservationRepository implements IReservationRepository {
  private queryBuilder;

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex;
  }

  /**
   * Fetch Reservation entry by unique ID
   * @param id ID of Reservation entry
   * @returns {ReservationRow} reservation entry
   */
  public async getReservationById(id: number): Promise<ReservationRow> {
    const reservation = await knex("Reservations").where({ id }).first();
    if (!reservation) throw new EntityNotFound("Could not find reservation #${id}");
    return reservation;
  }

  /**
   * Fetch all Reservations in the table
   * @returns {ReservationRow[]} all entries
   */
  public async getReservations(): Promise<ReservationRow[]> {
    return knex("Reservations").select();
  }

  /**
   * Determines if reserving maker is has the necessary trainings to reserve the noted equipment
   * @param reservation {ReservationInput} the reservation details
   * @returns true if eligible
   */
  public async userIsEligible(reservation: ReservationInput): Promise<boolean> {
    // get all modules needed for the equipment
    const modules = (
      await this.queryBuilder("ModulesForEquipment")
      .select("trainingModuleId")
      .where("equipmentId", reservation.equipmentID)
    );
    let passed = true;
    // get last submission from maker for every module
    modules.forEach(async (module: any) => {
      const eligibility = await this.queryBuilder("ModuleSubmissions")
        .select("passed")
        .where("moduleID", module.id)
        .where("makerID", reservation.makerID)
        .orderBy("submissionDate", "desc")
        .limit(1)
        .first();
      if (!eligibility) {
        passed = false;
      }
    });
    return passed;
  }

  /**
   * Determine if the reservation can be added without overlapping with existing reservations
   * @param reservation the proposed reservation
   * @returns true if no time conflicts are present
   */
  public async noConflicts(reservation: ReservationInput): Promise<boolean> {
      const conflicts = await this.queryBuilder("Reservations")
        .select()
        .whereBetween("startTime", [reservation.startTime, reservation.endTime])
        .orWhereBetween("endTime", [reservation.startTime, reservation.endTime])
        .orWhereBetween(reservation.startTime, ["startTime", "endTime"])
        .orWhereBetween(reservation.endTime, ["startTime", "endTime"])
        .as('t') 
        .count("t.* as count");
      if (conflicts == 0){
        return true;
      } else {
        return false;
      }
  }


  /**
   * Create Reservation and append it to the table
   * @param reservation proposed reservation
   * @returns created reservation
   */
    public async createReservation(reservation: ReservationInput): Promise<ReservationRow> {
      const [newId] = (
        await this.queryBuilder("Reservations").insert(
          {
            makerID: reservation.makerID,
            equipmentID: reservation.equipmentID,
            startTime: reservation.startTime,
            endTime: reservation.endTime
          },
          "id"
        )
      );
      await this.addComment(newId, reservation.makerID, reservation.startingMakerComment);
      return this.getReservationById(newId);
    }

  /**
   * Create a comment assigned to a specified reservation
   * @param resID reservation ID
   * @param authorId user ID
   * @param commentText Comment string
   * @returns ID of created comment
   * @throws EntityNotFound failed to create comment
   */
  public async addComment(resID: number, authorId: number, commentText: string): 
  Promise<ReservationEventRow> {
    const [newId] = (
      await this.queryBuilder("ReservationEvents").insert(
        {
          eventType: "COMMENT",
          reservationID: resID,
          userID: authorId,
          payload: commentText
        },
        "id"
      )
    );
    
    const commentID = await knex("ReservationEvents").where({ id: newId }).first();
    if (!commentID) throw new EntityNotFound("Could not find comment #${newId}");
    return commentID;
  }


  /**
   * Update reservation to CONFIRMED
   * @param resID reservation ID
   * @returns the updated reservation
   */
  public async confirmReservation(resID: number): Promise<ReservationRow> {
    await this.queryBuilder("Reservations")
    .where("id", resID)
    .update({status: "CONFIRMED", lastUpdated: Date.now()});
    return this.getReservationById(resID);
  }

  /**
   * Update reservation to CANCELLED
   * @param resID reservation ID
   * @returns the updated reservation
   */
  public async cancelReservation(resID: number): Promise<ReservationRow> {
    await this.queryBuilder("Reservations")
    .where("id", resID)
    .update({status: "CANCELLED", lastUpdated: Date.now()});
    return this.getReservationById(resID);
  }
}
