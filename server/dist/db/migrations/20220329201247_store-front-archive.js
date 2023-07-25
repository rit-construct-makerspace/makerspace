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
        knex.schema.hasTable("InventoryItem").then(function (exists) {
            if (!exists)
                return;
            return knex.schema.alterTable("InventoryItem", function (t) {
                t.boolean("archived").defaultTo(false);
            });
        });
        knex.schema.hasTable("Label").then(function (exists) {
            if (!exists)
                return;
            return knex.schema.alterTable("Label", function (t) {
                t.boolean("archived").defaultTo(false);
            });
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        knex.schema.hasTable("InventoryItem").then(function (exists) {
            if (!exists)
                return;
            return knex.schema.alterTable("InventoryItem", function (t) {
                t.dropColumn("archived");
            });
        });
        knex.schema.hasTable("Label").then(function (exists) {
            if (!exists)
                return;
            return knex.schema.alterTable("Label", function (t) {
                t.dropColumn("archived");
            });
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220329201247_store-front-archive.js.map