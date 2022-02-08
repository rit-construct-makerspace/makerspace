import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    
    return knex.schema.hasTable('EquipmentLabels').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('EquipmentLabels', function(t) {
                t.increments('id');
                t.string('name', 50);
                t.specificType('trainingModules', 'integer ARRAY')
                  .references('id').inTable('TrainingModule');
              });
        }
    }).then(async () => {
      const exists = await knex.schema.hasTable('Equipment');
      if (!exists) {
        return knex.schema.createTable('Equipment', function (t) {
          t.increments('id');
          t.string('name', 50);
          t.specificType('equipmentLabels', 'integer ARRAY')
            .references('id').inTable('EquipmentLabels');
          t.string('room', 5);
          t.timestamp('addedAt').defaultTo(knex.fn.now());
          t.boolean('inUse').defaultTo(false);
        });
      }
    }).then(async () => {
      const exists = await knex.schema.hasTable('Reservations');
      if (!exists) {
        return knex.schema.createTable('Reservations', function (t) {
          t.increments('id');
          t.integer('userId').references('id').inTable('Users');
          t.integer('equipmentId').references('id').inTable('Equipment');
          t.timestamp('createdAt').defaultTo(knex.fn.now());
          t.time('startTime');
          t.time('endTime');
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
    const exists = await knex.schema.hasTable('Equipment');
    if (exists) {
      return knex.schema.dropTable('Equipment');
    }
  }).then(async () => {
    knex.schema.hasTable('Reservations').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('Reservations');
    }
  });
});

}