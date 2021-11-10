import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('Students').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Students', function(t) {
            t.increments('id');
            t.string('first_name', 100);
            t.string('last_name', 100);
            t.text('email').unique();
            t.integer('year');
            t.text('major');
            t.text('collage');
            t.date('registration_date').defaultTo(knex.fn.now());
            t.decimal('balance');
            t.boolean('hold').defaultTo(false);
          });
        }
    });
    
}

export async function down(knex: Knex): Promise<void> {

  knex.schema.hasTable('Students').then(function(exists) {
    if (!exists) {
      return knex.schema.dropTable('Students');
    }
  });

}

