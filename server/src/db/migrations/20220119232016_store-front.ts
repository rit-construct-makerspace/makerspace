import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('InventoryItem').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('InventoryItem', function (t) {
                t.increments('id').primary();
                t.text('image');
                t.text('name');
                t.text('unit');
                t.text('pluralUnit');
                t.integer('count');
                t.float('pricePerUnit');
            });
        }
    });

    knex.schema.hasTable('Label').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('Label', function (t) {
                t.increments('id').primary();
                t.text('label');
            });
        }
    });

    knex.schema.hasTable('InventoryItemLabel').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('Label', function (t) {
                t.increments('id').primary();
                t.integer('item')
                    .references('InventoryItem.id');
                t.integer('label')
                    .references('Label.id');
            });
        }
    });

    knex.schema.hasTable('PurchaseOrder').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('PurchaseOrder', function (t) {
                t.increments('id').primary();
                t.text('creator'); // update this when we have user stuff done
                t.date('createDate');
                t.date('expectedDeliveryDate');
                t.text('text')
            });
        }
    });

    knex.schema.hasTable('PurchaseOrderItem').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('PurchaseOrderItem', function (t) {
                t.increments('id').primary();
                t.integer('item')
                    .references('InventoryItem.id');
                t.integer('purchaseOrder')
                    .references('PurchaseOrder.id');
                t.integer('count');
            });
        }
    });

    knex.schema.hasTable('PurchaseOrderAttachment').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('PurchaseOrderAttachment', function (t) {
                t.increments('id').primary();
                t.integer('purchaseOrder')
                    .references('PurchaseOrder.id');
                t.text('attachment');
            });
        }
    });

}


export async function down(knex: Knex): Promise<void> {

    knex.schema.hasTable('InventoryItem').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('InventoryItem');
        }
    });

    knex.schema.hasTable('Label').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('Label');
        }
    });

    knex.schema.hasTable('InventoryItemLabel').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('InventoryItemLabel');
        }
    });

    knex.schema.hasTable('PurchaseOrder').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('PurchaseOrder');
        }
    });

    knex.schema.hasTable('PurchaseOrderItem').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('PurchaseOrderItem');
        }
    });

    knex.schema.hasTable('PurchaseOrderAttachment').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('PurchaseOrderAttachment');
        }
    });

}

