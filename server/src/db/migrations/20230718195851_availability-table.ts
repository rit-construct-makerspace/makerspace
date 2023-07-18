import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.hasTable('Availability').then(function (exists){
        if (!exists) {
            return knex.schema.createTable('Availability', function (t) {
                t.increments('id').primary();
                t.dateTime('date');
                t.dateTime('startTime');
                t.dateTime('endTime');
                t.integer('userID').references('id').inTable('Users');
            });
        }
    });
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.hasTable('Availability').then(function(exists) {
        if (exists) {
            return knex.schema.dropTable('Availability')
        }
    });
}