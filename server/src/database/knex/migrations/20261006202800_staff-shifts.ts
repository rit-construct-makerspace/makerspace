import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("StaffShifts", (table) => {
    table.increments("id").primary();
    table.integer("makerspaceID").references("id").inTable("Zones").notNullable()
      .onUpdate("CASCADE").onDelete("CASCADE");
    table.integer("userID").notNullable();
    table.timestamp("start").notNullable();
    table.timestamp("end").notNullable();
    table.foreign(["userID", "makerspaceID"]).references(["userID", "makerspaceID"]).inTable("Staff")
      .onUpdate("CASCADE").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("StaffShifts");
}
