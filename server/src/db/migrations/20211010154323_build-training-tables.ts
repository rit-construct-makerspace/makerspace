import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.hasTable("TrainingModule").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("TrainingModule", function (t) {
        t.increments("id").primary();
        t.string("name", 100);
      });
    }
  });

  knex.schema.hasTable("ModuleItem").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("ModuleItem", function (t) {
        t.increments("id").primary();
        t.integer("module").references("TrainingModule.id").onDelete("CASCADE"); // If module is deleted, delete moduleItem as well
        t.enu("moduleItemType", [
          "MULTIPLE_CHOICE",
          "CHECKBOXES",
          "TEXT",
          "YOUTUBE",
          "IMAGE",
        ]);
        t.text("text");
      });
    }
  });

  knex.schema.hasTable("ModuleItemOption").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("ModuleItemOption", function (t) {
        t.increments("id");
        t.integer("moduleItem").references("ModuleItem.id").onDelete("CASCADE"); // If moduleItem is deleted, delete option as well
        t.text("text");
        t.boolean("correct");
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.hasTable("TrainingModule").then(function (exists) {
    if (exists) {
      return knex.schema.dropTable("TrainingModule");
    }
  });

  knex.schema.hasTable("ModuleItem").then(function (exists) {
    if (exists) {
      return knex.schema.dropTable("ModuleItem");
    }
  });

  knex.schema.hasTable("ModuleItemOption").then(function (exists) {
    if (exists) {
      return knex.schema.dropTable("ModuleItemOption");
    }
  });
}
