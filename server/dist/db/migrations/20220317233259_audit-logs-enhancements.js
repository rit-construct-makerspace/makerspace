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
        return knex.schema.alterTable("AuditLogs", function (t) {
            t.dropColumn("eventType");
            t.dropColumn("userID");
            t.renameColumn("timeDate", "dateTime");
            t.renameColumn("description", "message");
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.alterTable("AuditLogs", function (t) {
            t.integer("userID").references("id").inTable("Users");
            t.enu("eventType", [
                "DATABASE_MODIFICATION",
                "PURCHASE_ORDERS",
                "RESERVATIONS",
                "TRAINING",
                "INVENTORY_MANAGEMENT",
                "TRAINING_MANAGEMENT",
                "EQUIPMENT_MANAGEMENT",
                "USER_MANAGEMENT",
                "ROOM_MANAGEMENT",
            ]);
            t.renameColumn("dateTime", "timeDate");
            t.renameColumn("message", "description");
        });
    });
}
exports.down = down;
//# sourceMappingURL=20220317233259_audit-logs-enhancements.js.map