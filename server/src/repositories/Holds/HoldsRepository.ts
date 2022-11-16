import { knex } from "../../db";
import { EntityNotFound } from "../../EntityNotFound";
import { HoldRow } from "../../db/tables";

export async function getHold(
  id: string
): Promise<HoldRow> {
  const hold = await knex("Holds").first().where({ id });

  if (!hold) throw new EntityNotFound(`Hold #${id} not found`);

  return hold;
}

export async function createHold(
  creatorID: string,
  userID: string,
  description: string
): Promise<HoldRow> {
  const [holdID] = await knex("Holds").insert(
    {
      creatorID,
      userID,
      description: description,
    },
    "id"
  );

  return getHold(holdID);
}

export async function removeHold(
  holdID: string,
  removerID: string
): Promise<HoldRow> {
  await knex("Holds")
    .update({
      removerID,
      removeDate: knex.fn.now(),
    })
    .where({ id: holdID });

  return getHold(holdID);
}

export async function getHoldsByUser(
  userID: string
): Promise<HoldRow[]> {
  return await knex("Holds").select().where({ userID }).orderBy("createDate", "DESC");
}

export async function hasActiveHolds(
  userID: string
): Promise<boolean> {
  return (await getHoldsByUser(userID)).some((hold: HoldRow) => {
    // User has an active hold if its remove date does not exist or is greater than current time
    return !hold.removeDate || hold.removeDate > new Date();
  });
}
