import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable("Equipment")
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable("Equipment", function (t) {
          t.increments("id");
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
          t.increments("id");
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
        return knex.schema.createTable("Reservations", function (t) {
          t.increments("id");
          t.integer("userId").references("id").inTable("Users");
          t.integer("equipmentId").references("id").inTable("Equipment");
          t.timestamp("createdAt").defaultTo(knex.fn.now());
          t.time("startTime");
          t.time("endTime");
        });
      }
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable("Equipment")
    .then(function (exists) {
      if (exists) {
        return knex.schema.dropTable("Equipment");
      }
    })
    .then(async () => {
      const exists = await knex.schema.hasTable("ModulesForEquipment");
      if (exists) {
        return knex.schema.dropTable("ModulesForEquipment");
      }
    })
    .then(async () => {
      knex.schema.hasTable("Reservations").then(function (exists) {
        if (exists) {
          return knex.schema.dropTable("Reservations");
        }
      });
    });
}
