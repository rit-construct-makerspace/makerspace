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
        const exists = yield knex.schema.hasTable("Users");
        if (!exists)
            return;
        return knex.schema.alterTable("Users", (t) => {
            t.dropColumn("roomID");
            t.dropColumn("monitoringRoomID");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = yield knex.schema.hasTable("Users");
        if (!exists)
            return;
        return knex.schema.alterTable("Users", (t) => {
            t.integer("roomID").references("id").inTable("Rooms");
            t.integer("monitoringRoomID").references("id").inTable("Rooms");
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220325155145_remove-monitoring.js.map