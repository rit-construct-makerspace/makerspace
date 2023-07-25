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
const usersSchema_1 = require("../../schemas/usersSchema");
exports.seed = function (knex) {
    const roomSeed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        return knex('Rooms').del()
            .then(function () {
            return knex('Rooms').insert([
                { id: 1, name: 'Room I', archived: false },
                { id: 2, name: 'Room II', archived: false },
                { id: 3, name: 'Room III', archived: false }
            ]);
        });
    }));
    const equipmentSeed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield knex('Equipment').del()
            .then(function () {
            return knex('Equipment').insert([
                { id: 1, name: 'CNC Machine', addedAt: new Date("2023-03-05"), inUse: false, roomID: 1, archived: false },
                { id: 2, name: 'Drill Press', addedAt: new Date("2023-03-05"), inUse: false, roomID: 1, archived: false },
                { id: 3, name: 'T-Tech PCB Mill', addedAt: new Date("2023-03-05"), inUse: false, roomID: 1, archived: false }
            ]);
        });
        resolve();
    }));
    const trainingModulesSeed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield knex('TrainingModule').del()
            .then(function () {
            return knex('TrainingModule').insert([
                { id: 1, name: 'Training: CNC Machine', archived: false },
                { id: 2, name: 'Training: Drill Press', archived: false },
                { id: 3, name: 'Training: T-Tech PCB Mill', archived: false }
            ]);
        });
        resolve();
    }));
    const trainingModulesForEquipmentSeed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield knex('ModulesForEquipment').del()
            .then(function () {
            return knex('ModulesForEquipment').insert([
                { id: 1, moduleID: 1, equipmentID: 1 },
                { id: 2, moduleID: 2, equipmentID: 2 },
                { id: 3, moduleID: 3, equipmentID: 3 },
            ]);
        });
        resolve();
    }));
    const usersSeed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield knex('Users').del()
            .then(function () {
            return knex('Users').insert([
                { firstName: 'Heinz', lastName: 'Doofenshmirtz', email: 'dhd5555@rit.edu', privilege: usersSchema_1.Privilege.STAFF,
                    expectedGraduation: "Spring 2025", college: 'GCCIS', pronouns: "he/him", ritUsername: 'dhd5555' }
            ]);
        });
    }));
    return roomSeed
        .then(() => equipmentSeed)
        .then(() => trainingModulesSeed)
        .then(() => trainingModulesForEquipmentSeed)
        .then(() => usersSeed);
};
//# sourceMappingURL=seed_test_data.js.map