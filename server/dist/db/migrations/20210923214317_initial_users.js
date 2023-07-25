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
        knex.schema.hasTable("Users").then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("Users", function (t) {
                    t.increments("id").primary();
                    t.string("firstName", 100);
                    t.string("lastName", 100);
                    t.text("email").unique();
                    t.boolean("isStudent").defaultTo(true);
                    t.enu("privilege", ["MAKER", "MENTOR", "STAFF"]).defaultTo("MAKER");
                    t.date("registrationDate").defaultTo(knex.fn.now());
                    t.text("expectedGraduation");
                    t.text("college");
                    t.text("major");
                });
            }
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        knex.schema.hasTable("Users").then(function (exists) {
            if (exists) {
                return knex.schema.dropTable("Users");
            }
        });
    });
}
exports.down = down;
//# sourceMappingURL=20210923214317_initial_users.js.map