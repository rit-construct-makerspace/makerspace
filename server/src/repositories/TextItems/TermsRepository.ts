import { knex } from "../../db/index.js";
import {  TextFieldRow } from "../../db/tables.js";



export async function getTerms(): Promise<TextFieldRow | undefined> {
    return await knex("TextFields").select().where({id: 1}).first();
}

export async function setTerms(value: string): Promise<number> {
    return await knex("TextFields").update({value}).where({id: 1});
}
