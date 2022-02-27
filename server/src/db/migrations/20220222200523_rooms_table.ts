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

