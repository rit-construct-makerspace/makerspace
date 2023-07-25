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
        const alterUsers = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Users").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Users", function (t) {
                            t.index("id", "Users_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterEquipment = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Equipment").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Equipment", function (t) {
                            t.index("id", "Equipment_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterRooms = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Rooms").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Rooms", function (t) {
                            t.index("id", "Rooms_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterTrainingModules = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("TrainingModule").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("TrainingModule", function (t) {
                            t.index("id", "TrainingModules_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterInventoryItems = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("InventoryItem").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("InventoryItem", function (t) {
                            t.index("id", "InventoryItem_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterLabels = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Label").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Label", function (t) {
                            t.index("id", "Label_active_idx", {
                                predicate: knex.whereRaw("archived = FALSE")
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        return Promise.all([
            alterUsers,
            alterEquipment,
            alterRooms,
            alterTrainingModules,
            alterInventoryItems,
            alterLabels
        ]);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        const alterUsers = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Users").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Users", function (t) {
                            t.dropIndex("id", "Users_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterEquipment = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Equipment").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Equipment", function (t) {
                            t.dropIndex("id", "Equipment_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterRooms = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Rooms").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Rooms", function (t) {
                            t.dropIndex("id", "Rooms_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterTrainingModules = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("TrainingModule").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("TrainingModule", function (t) {
                            t.dropIndex("id", "TrainingModules_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterInventoryItems = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("InventoryItem").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("InventoryItem", function (t) {
                            t.dropIndex("id", "InventoryItem_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        const alterLabels = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Label").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.alterTable("Label", function (t) {
                            t.dropIndex("id", "Label_active_idx");
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        return Promise.all([
            alterUsers,
            alterEquipment,
            alterRooms,
            alterTrainingModules,
            alterInventoryItems,
            alterLabels
        ]);
    });
}
exports.down = down;
//# sourceMappingURL=20230305005055_archival_partitions.js.map