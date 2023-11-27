import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('Equipment', function(t) {
        t.string('pictureURL');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('Equipment', function(t) {
        t.dropColumn('pictureURL');
    });
}