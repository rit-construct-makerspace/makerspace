import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable("Equipment")
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable("Equipment", function (t) {
          t.increments("id").primary();
          t.string("name", 50);
          t.timestamp("addedAt").defaultTo(knex.fn.now());
          t.boolean("inUse").defaultTo(false);
        });
      }
    })
    .then(async () => {
      const exists = await knex.schema.hasTable("ModulesForEquipment");
      if (!exists) {
        return knex.schema.createTable("ModulesForEquipment", function (t) {
          t.increments("id").primary();
          t.integer("equipmentId").references("id").inTable("Equipment");
          t.integer("trainingModuleId")
            .references("id")
            .inTable("TrainingModule");
        });
      }
    })
    .then(async () => {
      const exists = await knex.schema.hasTable("Reservations");
      if (!exists) {
        return knex.schema.createTable('Reservations', function (t) {
          t.increments('id');
          t.integer('creator').references('id').inTable('Users');
          t.integer('maker').references('id').inTable('Users');
          t.integer('labbie').references('id').inTable('Users');
          t.timestamp('createDate').defaultTo(knex.fn.now());
          t.time('startTime');
          t.time('endTime');
          t.integer('equipment').references('id').inTable('Equipment');
          t.enu('status', ['PENDING', 'CONFIRMED', 'CANCELLED']);
          t.timestamp('lastUpdated').defaultTo(knex.fn.now());
          t.boolean('independent').defaultTo(false);
        });
      }
    }).then(async () => {
      const exists = await knex.schema.hasTable('ReservationEvents');
      if (!exists) {
        return knex.schema.createTable('ReservationEvents', function (t) {
          t.increments('id');
          t.enu('eventType', ['COMMENT', 'ASSIGNMENT', 'CONFIRMATION', 'CANCELLATION']);
          t.integer('user').references('id').inTable('Users');
          t.timestamp('dateTime').defaultTo(knex.fn.now());
          t.string('payload', 500);
        });
      }
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.hasTable('Equipment').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('Equipment');
    }
  }).then(async () => {
    const exists = await knex.schema.hasTable('ModulesForEquipment');
    if (exists) {
      return knex.schema.dropTable('ModulesForEquipment');
    }
  }).then(async () => {
    const exists = await knex.schema.hasTable('Reservations');
    if (exists) {
      return knex.schema.dropTable('Reservations');
    }
  }).then(async () => {
    const exists = await knex.schema.hasTable('ReservationEvents');
    if (exists) {
      return knex.schema.dropTable('ReservationEvents');
    }
  });
}
