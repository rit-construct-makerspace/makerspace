import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    
    return knex.schema.hasTable('MachineFamilies').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('MachineFamilies', function(t) {
                t.increments('id');
                t.string('name', 50);
                t.text('description');
                t.integer('training_module').references('id').inTable('TrainingModule');
              });
        }
    }).then(async () => {
      const exists = await knex.schema.hasTable('Machines');
      if (!exists) {
        return knex.schema.createTable('Machines', function (t) {
          t.increments('id');
          t.string('name', 50);
          t.integer('machine_family').references('id').inTable('MachineFamilies');
          t.string('room', 5);
          t.timestamp('added_at').defaultTo(knex.fn.now());
          t.boolean('in_use').defaultTo(false);
        });
      }
    }).then(async () => {
      const exists = await knex.schema.hasTable('Reservations');
      if (!exists) {
        return knex.schema.createTable('Reservations', function (t) {
          t.increments('id');
          t.integer('student_id').references('id').inTable('User');
          t.integer('machine_id').references('id').inTable('Machines');
          t.timestamp('created_at').defaultTo(knex.fn.now());
          t.time('start_time');
          t.time('end_time');
        });
      }
    });

}

export async function down(knex: Knex): Promise<void> {

  return knex.schema.hasTable('MachineFamilies').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('MachineFamilies');
    }
  }).then(async () => {
    const exists = await knex.schema.hasTable('Machines');
    if (exists) {
      return knex.schema.dropTable('Machines');
    }
  }).then(async () => {
    knex.schema.hasTable('Machines').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('Reservations');
    }
  });
});

}