import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('Holds').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('Holds', function(t) {
                t.increments('id');
                t.enu('type', ['INCOMPLETE_TRAINING', 'SAFETY_VIOLATION', 'BALANCE_DUE']);
                t.text('description');
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('removed_at');
                t.integer('user_id').references('id').inTable('Users');
              });
        }
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.hasTable('Holds').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('Holds');
        }
      });
}
