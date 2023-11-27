import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.hasTable('MachineLogs').then(function (exists){
        if (!exists) {
            return knex.schema.createTable('MachineLogs', function (t) {
                t.increments('id').primary();
                t.integer('dateTime');
                t.integer('machineID').references('id').inTable("Equipment");
                t.integer('userID').references('id').inTable('Users');
            });
        }
    });
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.hasTable('MachineLogs').then(function(exists) {
        if (exists) {
            return knex.schema.dropTable('MachineLogs')
        }
    });
}