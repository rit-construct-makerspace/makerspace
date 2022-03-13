import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Question", function (t) {
        t.integer("order");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Question", function (t) {
        t.dropColumn("order");
    });
}

