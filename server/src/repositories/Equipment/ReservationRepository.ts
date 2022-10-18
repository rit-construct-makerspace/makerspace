import { knex } from "../../db";
import { EntityNotFound } from "../../EntityNotFound";
import { ReservationRow, ReservationEventRow } from "../../db/tables";
import { ReservationInput } from "../../schemas/reservationsSchema";
import { formatISO, formatISO9075 } from "date-fns";

export async function getReservationByID(id: number): Promise<ReservationRow> {
  const reservation = await knex("Reservations").where({ id }).first();
  if (!reservation)
    throw new EntityNotFound("Could not find reservation #${id}");
  return reservation;
}

export async function getReservations(): Promise<ReservationRow[]> {
  return knex("Reservations").select();
}

export async function getReservationsByEquipmentID(
  equipmentID: number,
  start: Date,
  end: Date
) {
  return knex("Reservations")
    .select()
    .where({ equipmentID })
    .andWhere("startTime", ">=", formatISO9075(start))
    .andWhere("endTime", "<=", formatISO9075(end));
}

export async function getReservationEvents(reservationID: number) {
  return knex("ReservationEvents").select().where({ reservationID });
}

export async function userIsEligible(
  userID: number,
  equipmentID: number
): Promise<boolean> {
  const requiredModules = await knex("ModulesForEquipment")
    .select()
    .where("equipmentID", equipmentID);

  for (let i = 0; i < requiredModules.length; i++) {
    const eligibility = await knex("ModuleSubmissions")
      .where({
        moduleID: requiredModules[i].moduleID,
        makerID: userID,
        passed: true,
      })
      .orderBy("submissionDate", "desc")
      .first();

    if (!eligibility) return false;
  }

  return true;
}

export async function noConflicts(
  start: Date,
  end: Date,
  equipmentID: number
): Promise<boolean> {
  const startString = formatISO9075(start);
  const endString = formatISO9075(end);

  const overlappingReservations = await knex("Reservations")
    .select()
    .where({ equipmentID })
    .whereBetween("startTime", [startString, endString])
    .orWhereBetween("endTime", [startString, endString]);

  if (overlappingReservations.length !== 0) return false;

  const encompassingReservations = await knex("Reservations")
    .select()
    .where({ equipmentID })
    .where("startTime", "<=", startString)
    .andWhere("endTime", ">=", endString);

  return encompassingReservations.length === 0;
}

export async function createReservation({
  makerID,
  equipmentID,
  startTime,
  endTime,
  comment,
}: ReservationInput): Promise<ReservationRow> {
  const startString = formatISO9075(startTime);
  const endString = formatISO9075(endTime);

  const [newID] = await knex("Reservations").insert(
    {
      makerID,
      equipmentID,
      startTime: startString,
      endTime: endString,
    },
    "id"
  );

  if (comment) {
    await addComment(newID, makerID, comment);
  }

  return getReservationByID(newID);
}

export async function addComment(
  resID: number,
  authorId: number,
  commentText: string
): Promise<ReservationEventRow> {
  const [newID] = await knex("ReservationEvents").insert(
    {
      eventType: "COMMENT",
      reservationID: resID,
      userID: authorId,
      payload: commentText,
    },
    "id"
  );

  const commentID = await knex("ReservationEvents")
    .where({ id: newID })
    .first();

  if (!commentID) throw new EntityNotFound(`Could not find comment #${newID}`);

  return commentID;
}

export async function confirmReservation(
  resID: number
): Promise<ReservationRow> {
  await knex("Reservations")
    .where("id", resID)
    .update({ status: "CONFIRMED", lastUpdated: knex.fn.now() });

  return getReservationByID(resID);
}

export async function cancelReservation(
  resID: number
): Promise<ReservationRow> {
  await knex("Reservations")
    .where("id", resID)
    .update({ status: "CANCELLED", lastUpdated: knex.fn.now() });

  return getReservationByID(resID);
}
