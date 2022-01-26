import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('Holds').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('Holds', function(t) {
                t.increments('id');
                t.enu('type', ['incomplete_training', 'safety_violation', 'financial']);
                t.text('description');
                t.timestamp('created_on').defaultTo(knex.fn.now());
                t.timestamp('removed_on');
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
