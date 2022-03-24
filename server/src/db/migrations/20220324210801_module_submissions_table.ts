import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable("ModuleSubmissions")
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable("ModuleSubmissions", function (t) {
          t.increments("id").primary();
          t.integer("moduleId").references("id").inTable("TrainingModule");
          t.integer('makerId').references('id').inTable('Users');
          t.timestamp("submissionDate").defaultTo(knex.fn.now());
          t.boolean("passed");
        });
      }
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable("ModuleSubmissions")
    .then(function (exists) {
      if (exists) {
        return knex.schema.dropTable("ModuleSubmissions");
      }
    });
}
