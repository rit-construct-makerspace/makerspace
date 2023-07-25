"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTable("PurchaseOrderAttachment")
            .dropTable("PurchaseOrderItem")
            .dropTable("PurchaseOrder");
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        knex.schema.hasTable("PurchaseOrder").then((exists) => {
            if (!exists) {
                return knex.schema.createTable("PurchaseOrder", (t) => {
                    t.increments("id").primary();
                    t.text("creator");
                    t.date("createDate");
                    t.date("expectedDeliveryDate");
                });
            }
        });
        knex.schema.hasTable("PurchaseOrderItem").then((exists) => {
            if (!exists) {
                return knex.schema.createTable("PurchaseOrderItem", (t) => {
                    t.increments("id").primary();
                    t.integer("item").references("InventoryItem.id");
                    t.integer("purchaseOrder")
                        .references("PurchaseOrder.id")
                        .onUpdate('CASCADE')
                        .onDelete("CASCADE");
                    t.integer("count");
                });
            }
        });
        knex.schema.hasTable("PurchaseOrderAttachment").then((exists) => {
            if (!exists) {
                return knex.schema.createTable("PurchaseOrderAttachment", (t) => {
                    t.increments("id").primary();
                    t.integer("purchaseOrder")
                        .references("PurchaseOrder.id")
                        .onUpdate('CASCADE')
                        .onDelete("CASCADE");
                    t.text("attachment");
                });
            }
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220223212706_remove-purchase-orders.js.map