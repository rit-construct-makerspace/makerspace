import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable("ModuleItem").then(function (exists) {
        if (!exists) return;

        return knex.schema.alterTable("ModuleItem", function (t) {
            t.integer("order");
        });
    });
}


export async function down(knex: Knex): Promise<void> {

    knex.schema.hasTable("ModuleItem").then(function (exists) {
        if (!exists) return;

        return knex.schema.alterTable("ModuleItem", function (t) {
            t.dropColumn("order");
        });
    });
}

