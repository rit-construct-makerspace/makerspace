import { knex } from "../../db";
import { Hold } from "../../schemas/holdsSchema";
import { EntityNotFound } from "../../EntityNotFound";

export async function getHold(id: number): Promise<Hold> {
  const hold = await knex("Holds").first().where({ id });

  if (!hold) throw new EntityNotFound(`Hold #${id} not found`);

  return hold;
}

export async function createHold(
  creatorID: number,
  userID: number,
  description: string
): Promise<Hold> {
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

export async function removeHold(holdID: number, removerID: number) {
  await knex("Holds")
    .update({
      removerID,
      removeDate: knex.fn.now(),
    })
    .where({ id: holdID });

  return getHold(holdID);
}

export async function getHoldsByUser(userID: number) {
  return knex("Holds").select().where({ userID }).orderBy("createDate", "DESC");
}
