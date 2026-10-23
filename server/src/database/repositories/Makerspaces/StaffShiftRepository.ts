import { GraphQLError } from "graphql";
import { knex } from "../../knex/index.js";
import { StaffShiftRow, UserRow } from "../../knex/tables.js";

export interface StaffShiftInput {
  userID: number;
  start: string;
  end: string;
}

export interface StaffShiftWithUser extends StaffShiftRow {
  user: UserRow;
}

export async function getMakerspaceStaff(makerspaceID: number): Promise<UserRow[]> {
  return knex("Users")
    .join("Staff", "Users.id", "Staff.userID")
    .where("Staff.makerspaceID", makerspaceID)
    .where("Users.archived", false)
    .select("Users.*")
    .orderBy("Users.firstName", "asc")
    .distinct();
}

export async function getStaffShifts(makerspaceID: number, start: string, end: string): Promise<StaffShiftWithUser[]> {
  const rangeStart = validDate(start);
  const rangeEnd = validDate(end);
  if (rangeStart >= rangeEnd) {
    throw new GraphQLError("The schedule range must end after it starts");
  }

  const shifts: StaffShiftRow[] = await knex("StaffShifts")
    .where({ makerspaceID })
    .where("start", "<", rangeEnd)
    .where("end", ">", rangeStart)
    .orderBy("start", "asc");
  const userIDs = [...new Set(shifts.map((shift) => shift.userID))];
  const users: UserRow[] = userIDs.length === 0
    ? []
    : await knex("Users").whereIn("id", userIDs);
  const usersByID = new Map(users.map((user) => [user.id, user]));

  return shifts.map((shift) => {
    const user = usersByID.get(shift.userID);
    if (!user) {
      throw new GraphQLError(`Staff member ${shift.userID} does not exist`);
    }
    return { ...shift, user };
  });
}

export async function getStaffShiftByID(id: number): Promise<StaffShiftRow | undefined> {
  return knex("StaffShifts").where({ id }).first();
}

export async function createStaffShifts(
  makerspaceID: number,
  shifts: StaffShiftInput[]
): Promise<StaffShiftRow[]> {
  if (shifts.length < 1 || shifts.length > 500) {
    throw new GraphQLError("Create between 1 and 500 shifts at a time");
  }

  const parsedShifts = shifts.map(({ userID, start, end }) => {
    const parsedStart = validDate(start);
    const parsedEnd = validDate(end);
    if (parsedStart >= parsedEnd) {
      throw new GraphQLError("A shift must end after it starts");
    }
    return { userID, start: parsedStart, end: parsedEnd };
  }).sort((left, right) => left.userID - right.userID || left.start.getTime() - right.start.getTime());

  for (let i = 1; i < parsedShifts.length; i++) {
    if (
      parsedShifts[i].userID === parsedShifts[i - 1].userID &&
      parsedShifts[i].start < parsedShifts[i - 1].end
    ) {
      throw new GraphQLError("The requested shifts overlap");
    }
  }

  return knex.transaction(async (transaction) => {
    const staffIDs = [...new Set(parsedShifts.map((shift) => shift.userID))];
    const assignedStaff = await transaction("Staff")
      .join("Users", "Staff.userID", "Users.id")
      .where({ makerspaceID })
      .where("Users.archived", false)
      .whereIn("userID", staffIDs)
      .select("Staff.userID")
      .orderBy("Staff.userID")
      .forUpdate("Staff");
    if (new Set(assignedStaff.map((staff) => staff.userID)).size !== staffIDs.length) {
      throw new GraphQLError("Shifts can only be assigned to staff for this makerspace");
    }

    for (const shift of parsedShifts) {
      const conflict = await transaction("StaffShifts")
        .where({ makerspaceID, userID: shift.userID })
        .where("start", "<", shift.end)
        .where("end", ">", shift.start)
        .first();
      if (conflict) {
        throw new GraphQLError("This staff member already has an overlapping shift");
      }
    }

    return transaction("StaffShifts").insert(
      parsedShifts.map((shift) => ({ makerspaceID, ...shift })),
      "*"
    );
  });
}

export async function updateStaffShift(id: number, start: string, end: string): Promise<StaffShiftRow> {
  const parsedStart = validDate(start);
  const parsedEnd = validDate(end);
  if (parsedStart >= parsedEnd) {
    throw new GraphQLError("A shift must end after it starts");
  }

  return knex.transaction(async (transaction) => {
    const shift = await transaction("StaffShifts").where({ id }).first() as StaffShiftRow | undefined;
    if (!shift) {
      throw new GraphQLError(`Shift ${id} does not exist`);
    }

    await transaction("Staff")
      .where({ makerspaceID: shift.makerspaceID, userID: shift.userID })
      .forUpdate()
      .first();

    const conflict = await transaction("StaffShifts")
      .where({ makerspaceID: shift.makerspaceID, userID: shift.userID })
      .whereNot({ id })
      .where("start", "<", parsedEnd)
      .where("end", ">", parsedStart)
      .first();
    if (conflict) {
      throw new GraphQLError("This staff member already has an overlapping shift");
    }

    const [updated] = await transaction("StaffShifts")
      .where({ id })
      .update({ start: parsedStart, end: parsedEnd }, "*");
    return updated;
  });
}

export async function deleteStaffShift(id: number): Promise<number> {
  return knex("StaffShifts").where({ id }).delete();
}

function validDate(value: string): Date {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new GraphQLError("Shift dates must be valid timestamps");
  }
  return date;
}
