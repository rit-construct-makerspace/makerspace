import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable("EquipmentGroups").then(function (exists) {
        if (!exists) return;

        return knex.schema.createTableIfNotExists("EquipmentGroups", function (t) {
            t.increments("id").primary();
            t.string("name").notNullable();
        });
    })
    .then(async () => {
        return knex.schema.createTableIfNotExists("EquipmentGroupsForEquipment", function (t) {
            t.increments("id").primary();
            t.integer("equipmentID").references("id").inTable("Equipment")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
            t.integer("equipmentGroupID").references("id").inTable("EquipmentGroups")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        });
    })
    .then(async () => {
        const exists = await knex.schema.hasTable("ModulesForEquipment");

        if (exists) {
            return knex.schema.alterTable("", function (t) {
                t.integer("equipmentGroupID").references("id").inTable("EquipmentGroups")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
            });
        }
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.hasTable("EquipmentGroups").then(function (exists) {
        if (!exists) return;

        return knex.schema.dropTableIfExists("EquipmentGroups");
    })
    .then(async () => {
        return knex.schema.dropTableIfExists("EquipmentGroupsForEquipment");
    });
}

