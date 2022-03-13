import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Users", function (t) {
        t.integer("roomID").references("id").inTable("Rooms").nullable().defaultTo(null);
        t.integer("monitoringRoomID").references("id").inTable("Rooms").nullable().defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Users", function (t) {
        t.dropColumn("roomID");
        t.dropColumn("monitoringRoomID");
    });
}


