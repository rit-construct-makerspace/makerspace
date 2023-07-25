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
            .hasTable("Equipment")
            .then(function (exists) {
            if (!exists) {
                return knex.schema.createTable("Equipment", function (t) {
                    t.increments("id").primary();
                    t.string("name", 50);
                    t.timestamp("addedAt").defaultTo(knex.fn.now());
                    t.boolean("inUse").defaultTo(false);
                });
            }
        })
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const exists = yield knex.schema.hasTable("ModulesForEquipment");
            if (!exists) {
                return knex.schema.createTable("ModulesForEquipment", function (t) {
                    t.increments("id").primary();
                    t.integer("equipmentID").references("id").inTable("Equipment")
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    t.integer("moduleID").references("id").inTable("TrainingModule")
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                });
            }
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const exists = yield knex.schema.hasTable("Reservations");
            if (!exists) {
                return knex.schema.createTable("Reservations", function (t) {
                    t.increments("id").primary();
                    t.integer("makerID").references("id").inTable("Users");
                    t.timestamp("createDate").defaultTo(knex.fn.now());
                    t.time("startTime");
                    t.time("endTime");
                    t.integer("equipmentID").references("id").inTable("Equipment");
                    t.enu('status', ['PENDING', 'CONFIRMED', 'CANCELLED']).defaultTo("PENDING");
                    t.timestamp('lastUpdated').defaultTo(knex.fn.now());
                });
            }
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const exists = yield knex.schema.hasTable("ReservationEvents");
            if (!exists) {
                return knex.schema.createTable("ReservationEvents", function (t) {
                    t.increments("id").primary();
                    t.enu("eventType", [
                        "COMMENT",
                        "ASSIGNMENT",
                        "CONFIRMATION",
                        "CANCELLATION",
                    ]);
                    t.integer("reservationID").references("id").inTable("Reservations");
                    t.integer("userID").references("id").inTable("Users");
                    t.timestamp("dateTime").defaultTo(knex.fn.now());
                    t.string("payload", 500);
                });
            }
        }));
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .hasTable("Equipment")
            .then(function (exists) {
            if (exists) {
                return knex.schema.dropTable("Equipment");
            }
        })
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const exists = yield knex.schema.hasTable("ModulesForEquipment");
            if (exists) {
                return knex.schema.dropTable("ModulesForEquipment");
            }
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            knex.schema.hasTable("Reservations").then(function (exists) {
                if (exists) {
                    return knex.schema.dropTable("Reservations");
                }
            });
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const exists = yield knex.schema.hasTable("ReservationEvents");
            if (exists) {
                return knex.schema.dropTable("ReservationEvents");
            }
        }));
    });
}
exports.down = down;
//# sourceMappingURL=20211102194503_machines_table.js.map