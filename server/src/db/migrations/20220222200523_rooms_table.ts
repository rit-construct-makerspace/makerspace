import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.hasTable('Rooms').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('Rooms', function(t) {
                t.increments('id').primary();
                t.string("name", 100);
            });
        }
    });

    knex.schema.hasTable('EquipmentForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('EquipmentForRooms', function(t) {
                t.increments('id').primary();
                t.integer("roomID").references('id').inTable('Rooms');
                t.integer('equipmentID').references('id').inTable("Equipment");
            });
        }
    });

    knex.schema.hasTable('LabbiesForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('LabbiesForRooms', function(t) {
                t.increments('id').primary();
                t.integer("roomID").references('id').inTable('Rooms');
                t.integer('labbiesID').references('id').inTable("Users");
            });
        }
    });

    knex.schema.hasTable('UsersForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('UsersForRooms', function(t) {
                t.increments('id').primary();
                t.integer("roomID").references('id').inTable('Rooms');
                t.integer('userID').references('id').inTable("Users");
            });
        }
    });

}


export async function down(knex: Knex): Promise<void> {
    knex.schema.hasTable('Rooms').then(function(exists) {
        if (!exists) {
            return knex.schema.dropTable('Rooms');
        }
    });
    knex.schema.hasTable('EquipmentForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.dropTable('EquipmentForRooms');
        }
    });
    knex.schema.hasTable('LabbiesForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.dropTable('LabbiesForRooms');
        }
    });
    knex.schema.hasTable('UsersForRooms').then(function(exists) {
        if (!exists) {
            return knex.schema.dropTable('UsersForRooms');
        }
    });
}

