import { knex } from "../../db";
import * as OptionMap from "../../mappers/training/optionMapper";
import { ModuleItemAnswer, Option } from "../../schemas/trainingSchema";
import { answersToDomain } from "../../mappers/training/moduleItemAnswersMapper";

export async function getOptionById(id: number): Promise<Option | null> {
  const knexResult = await knex("ModuleItemOption")
    .select("id", "moduleItem", "text", "correct")
    .where("id", id);
  return OptionMap.singleOptionToDomain(knexResult);
}

export async function getOptionsByModuleItem(
  moduleItemId: number
): Promise<Option[]> {
  const knexResult = await knex("ModuleItemOption")
    .select("id", "moduleItem", "text", "correct")
    .where("moduleItem", moduleItemId);
  return OptionMap.optionsToDomain(knexResult);
}

// returns a collection of ModuleItemAnswer Objects that repesent the correct
// answers for each module item in the module with the provided moduleID.
// Naming convention comes from the idea if this was pen/paper test
export async function getAnswerSheet(
  moduleID: string
): Promise<ModuleItemAnswer[] | null> {
  const knexResult = await knex("ModuleItemOption")
    .select("ModuleItemOption.id", "moduleItem")
    .join("ModuleItem", "ModuleItemOption.moduleItem", "ModuleItem.id")
    .where("ModuleItem.module", moduleID)
    .andWhere("correct", true);
  return answersToDomain(knexResult);
}

export async function addOptionToModuleItem(
  id: number,
  option: Option
): Promise<Option | null> {
  const insert = await knex("ModuleItemOption").insert(
    { moduleItem: id, text: option.text, correct: option.correct },
    "id"
  );
  return getOptionById(insert[0]);
}

export async function updateOption(option: Option): Promise<void> {
  const update = await knex("ModuleItemOption")
    .where({ id: option.id })
    .update({
      correct: option.correct,
      text: option.text,
    });
  return update;
}

export async function archiveOption(id: number): Promise<Option | null> {
  await knex("ModuleItemOption").where({ id: id }).update({ archived: true });
  return getOptionById(id);
}
