import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('Reservations', function(t) {
        t.dropColumn('startTime');
        t.dropColumn('endTime');
    })
        .then(function() {
            return knex.schema.alterTable('Reservations', function(t) {
                t.dateTime('startTime');
                t.dateTime('endTime');
            });
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('Reservations', function(t) {
        t.dropColumn('startTime');
        t.dropColumn('endTime');
    })
        .then(function() {
            return knex.schema.alterTable('Reservations', function(t) {
                t.time('startTime');
                t.time('endTime');
            });
        });
}

