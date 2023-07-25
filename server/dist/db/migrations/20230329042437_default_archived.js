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
        const alterEquipment = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Equipment").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.raw('ALTER TABLE "Equipment" ALTER COLUMN archived SET DEFAULT true');
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
                        yield knex.schema.raw('ALTER TABLE "TrainingModule" ALTER COLUMN archived SET DEFAULT true');
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        return Promise.all([
            alterEquipment,
            alterTrainingModules
        ]);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        const alterEquipment = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield knex.schema.hasTable("Equipment").then(function (exists) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (exists) {
                        yield knex.schema.raw('ALTER TABLE "Equipment" ALTER COLUMN archived SET DEFAULT false');
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
                        yield knex.schema.raw('ALTER TABLE "TrainingModule" ALTER COLUMN archived SET DEFAULT false');
                    }
                    else {
                        reject();
                    }
                });
            });
            resolve();
        }));
        return Promise.all([
            alterEquipment,
            alterTrainingModules
        ]);
    });
}
exports.down = down;
//# sourceMappingURL=20230329042437_default_archived.js.map