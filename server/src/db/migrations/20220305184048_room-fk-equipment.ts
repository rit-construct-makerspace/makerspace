import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Equipment", function (t) {
        t.integer("roomID").references("id").inTable("Rooms").nullable().defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Equipment", function (t) {
        t.dropColumn("roomID");
    });
}

