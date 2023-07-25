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
            .hasTable("ModuleSubmissions")
            .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("ModuleSubmissions", function (t) {
                    t.increments("id").primary();
                    t.integer("moduleID").references("id").inTable("TrainingModule");
                    t.integer('makerID').references('id').inTable('Users');
                    t.timestamp("submissionDate").defaultTo(knex.fn.now());
                    t.boolean("passed");
                });
            }
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .hasTable("ModuleSubmissions")
            .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable("ModuleSubmissions");
            }
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220324210801_module_submissions_table.js.map