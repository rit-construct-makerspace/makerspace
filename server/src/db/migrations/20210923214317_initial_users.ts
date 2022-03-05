import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('Users').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Users', function(t) {
            t.increments('id');
            t.string('first_name', 100);
            t.string('last_name', 100);
            t.text('email').unique();
            t.enu('type', ['STUDENT', 'FACULTY', 'EMPLOYEE']);
            t.enu('privilege_level', ['MAKER', 'LABBIE', 'ADMIN']).defaultTo('MAKER');
            t.date('registration_date').defaultTo(knex.fn.now());
            t.decimal('balance');
            t.integer('year');
            t.text('college');
            t.text('major');
          });
        }
    });
    
}

export async function down(knex: Knex): Promise<void> {

  knex.schema.hasTable('Users').then(function(exists) {
    if (!exists) {
      return knex.schema.dropTable('Users');
    }
  });

}
