import { knex } from "../../db";
import { ModuleItem } from "../../schemas/trainingSchema";
import * as ModuleItemMap from "../../mappers/training/moduleItemMapper";

export async function getModuleItem(
  moduleItemId: number | string
): Promise<ModuleItem | null> {
  const knexResult = await knex("ModuleItem")
    .select(
      "id",
      "module",
      "moduleItemType",
      "text",
      "order"
    )
    .where("id", moduleItemId);
  return ModuleItemMap.singleModuleItemToDomain(knexResult);
}

export async function getModuleItemsByModule(
  moduleId: number | string
): Promise<ModuleItem[]> {
  const knexResult = await knex("ModuleItem")
    .select(
      "id",
      "module",
      "moduleItemType",
      "text",
      "order"
    )
    .where("module", moduleId);
  return ModuleItemMap.ModuleItemsToDomain(knexResult);
}

export async function addModuleItem(
  moduleId: number,
  moduleItem: Omit<ModuleItem, "id" | "order">
): Promise<ModuleItem | null> {

  const newOrder = await getNextIndex(moduleId)

  const insert = await knex("ModuleItem").insert(
    { module: moduleId, moduleItemType: moduleItem.type, text: moduleItem.text, order: newOrder },
    "id"
  );

  return getModuleItem(insert[0]);
}

export async function updateModuleItemOrder(moduleId: number, moduleItemId: number, newOrder: number) {
  let moduleItem = await getModuleItem(moduleItemId)
  if (!moduleItem)
    throw new Error("Provided moduleItemId does not match existing moduleItem")
  let currentOrder = moduleItem.order
  updateOrderForOtherModuleItems(moduleId, moduleItemId, currentOrder, newOrder);
  await knex("ModuleItem")
    .where({ id: moduleItemId })
    .update({ order: newOrder });
}

async function updateOrderForOtherModuleItems(moduleId: number, moduleItemId: number, currentOrder: number, newOrder: number) {
  if (newOrder > currentOrder)
    await knex("ModuleItem")
      .where('module', moduleId).andWhere('order', '>=', currentOrder).andWhere('order', '<=', newOrder)
      .update({ order: knex.raw('?? - 1', ['order']) });
  else
    await knex("ModuleItem")
      .where('module', moduleId).andWhere('order', '<=', currentOrder).andWhere('order', '>=', newOrder)
      .update({ order: knex.raw('?? + 1', ['order']) });
}

export async function updateModuleItem(id: number, moduleItem: ModuleItem) {
  const current =
    (await knex("ModuleItem")
      .select(
        "module",
        "order"
      )
      .where("id", id))[0];
  await knex("ModuleItem")
    .where({ id: id })
    .update({ moduleItemType: moduleItem.type, text: moduleItem.text });
  if (current.order !== moduleItem.order && current?.module)
    await updateModuleItemOrder(current?.module, id, moduleItem.order)
}

async function getNextIndex(id: number) {
  const result = await knex('ModuleItem')
    .count('id')
    .groupBy('module')
    .having('module', '=', id);
  if (result[0] === undefined)
    return 0
  return result[0].count
}

export async function archiveModuleItem(id: number) {
  await knex("ModuleItem").where({ id: id}).update({archived: true})
  return getModuleItem(id);
}
