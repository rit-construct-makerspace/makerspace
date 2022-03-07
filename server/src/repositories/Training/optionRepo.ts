import { knex } from "../../db";
import * as OptionMap from "../../mappers/training/optionMapper";
import { Option } from "../../schemas/trainingSchema";


export async function getOptionById(id: number): Promise<Option | null> {
  const knexResult = await knex("QuestionOption")
    .select("id", "question", "text", "correct")
    .where("id", id);
  return OptionMap.singleOptionToDomain(knexResult);
}

export async function getOptionsByQuestion(
  questionId: number
): Promise<Option[]> {
  const knexResult = await knex("QuestionOption")
    .select("id", "question", "text", "correct")
    .where("question", questionId);
  return OptionMap.optionsToDomain(knexResult);
}

export async function addOptionToQuestion(
  id: number,
  option: Option
): Promise<Option | null> {
  const insert = await knex("QuestionOption").insert(
    { question: id, text: option.text, correct: option.correct },
    "id"
  );
  return getOptionById(insert[0]);
}

export async function updateOption(option: Option): Promise<void> {
  const update = await knex("QuestionOption")
    .where({ id: option.id })
    .update({
      correct: option.correct,
      text: option.text,
    });
  return update;
}

export async function deleteOptionById(id: number): Promise<void> {
  await knex("QuestionOption").where({ id: id }).del();
}

