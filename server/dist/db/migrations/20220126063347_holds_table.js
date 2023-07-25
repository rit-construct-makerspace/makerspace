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
        return knex.schema.hasTable("Holds").then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("Holds", function (t) {
                    t.increments("id");
                    t.integer("creatorID").references("id").inTable("Users")
                        .onUpdate('CASCADE')
                        .onDelete("SET NULL");
                    t.integer("removerID").references("id").inTable("Users")
                        .onUpdate('CASCADE')
                        .onDelete("SET NULL");
                    t.integer("userID").references("id").inTable("Users")
                        .onUpdate("CASCADE")
                        .onDelete("CASCADE");
                    t.text("description");
                    t.timestamp("createDate").defaultTo(knex.fn.now());
                    t.timestamp("removeDate");
                });
            }
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.hasTable("Holds").then(function (exists) {
            if (exists) {
                return knex.schema.dropTable("Holds");
            }
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220126063347_holds_table.js.map