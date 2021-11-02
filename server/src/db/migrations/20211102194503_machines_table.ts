import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('MachineFamilies').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('MachineFamilies', function(t) {
            t.increments('id');
            t.string('name', 50);
            t.text('description');
            t.integer('training_module');
            t.foreign('training_module').references('id').inTable('TrainingModule');
          });
        }
    });

    knex.schema.hasTable('Machines').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Machines', function(t) {
            t.increments('id');
            t.string('name', 50);
            t.string('category', 50);
            t.foreign('category').references('name').inTable('MachineFamilies');
            t.string('room', 5);
            t.boolean('reserved').defaultTo(false);
            t.date('date_added').defaultTo(knex.fn.now());
          });
        }
    });
    
}

export async function down(knex: Knex): Promise<void> {

  knex.schema.hasTable('MachineFamilies').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('MachineFamilies');
    }
  });

  knex.schema.hasTable('Machines').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('Machines');
    }
  });

}