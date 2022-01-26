import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('Users').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Users', function(t) {
            t.increments('id');
            t.string('first_name', 100);
            t.string('last_name', 100);
            t.text('email').unique();
            t.enu('type', ['student', 'faculty', 'employee']);
            t.enu('privilege_level', ['maker', 'labbie', 'admin']);
            t.date('registration_date').defaultTo(knex.fn.now());
            t.decimal('balance');
            t.integer('holds');
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
