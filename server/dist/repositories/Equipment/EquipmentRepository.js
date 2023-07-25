"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.addEquipment = exports.updateEquipment = exports.updateModules = exports.addModulesToEquipment = exports.getEquipmentForModule = exports.hasAccess = exports.hasTrainingModules = exports.getModulesByEquipment = exports.getEquipmentWithRoomID = exports.setEquipmentArchived = exports.getEquipmentByIDWhereArchived = exports.getEquipmentByID = exports.getEquipmentWhereArchived = exports.getEquipment = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
const ModuleRepo = __importStar(require("../Training/ModuleRepository"));
const HoldsRepo = __importStar(require("../Holds/HoldsRepository"));
const UserRepo = __importStar(require("../Users/UserRepository"));
function getEquipment() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("Equipment")
            .select();
    });
}
exports.getEquipment = getEquipment;
function getEquipmentWhereArchived(archived) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("Equipment")
            .select()
            .where({ archived: archived });
    });
}
exports.getEquipmentWhereArchived = getEquipmentWhereArchived;
function getEquipmentByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const equipment = yield (0, db_1.knex)("Equipment")
            .where({
            id: id
        })
            .first();
        if (!equipment)
            throw new EntityNotFound_1.EntityNotFound(`Could not find equipment #${id}`);
        return equipment;
    });
}
exports.getEquipmentByID = getEquipmentByID;
function getEquipmentByIDWhereArchived(id, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        const equipment = yield (0, db_1.knex)("Equipment")
            .where({
            id: id,
            archived: archived
        })
            .first();
        if (!equipment)
            throw new EntityNotFound_1.EntityNotFound(`Could not find equipment #${id}`);
        return equipment;
    });
}
exports.getEquipmentByIDWhereArchived = getEquipmentByIDWhereArchived;
function setEquipmentArchived(equipmentID, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedEquipment = yield (0, db_1.knex)("Equipment")
            .where({ id: equipmentID })
            .update({ archived: archived })
            .returning("*");
        if (updatedEquipment.length < 1)
            throw new EntityNotFound_1.EntityNotFound(`Could not find equipment #${equipmentID}`);
        return updatedEquipment[0];
    });
}
exports.setEquipmentArchived = setEquipmentArchived;
function getEquipmentWithRoomID(roomID, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("Equipment")
            .select()
            .where({
            roomID: roomID,
            archived: archived
        });
    });
}
exports.getEquipmentWithRoomID = getEquipmentWithRoomID;
function getModulesByEquipment(equipmentID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, db_1.knex)("ModulesForEquipment")
            .join("TrainingModule", "TrainingModule.id", "ModulesForEquipment.moduleID")
            .select("TrainingModule.*")
            .where("ModulesForEquipment.equipmentID", equipmentID);
    });
}
exports.getModulesByEquipment = getModulesByEquipment;
function hasTrainingModules(user, equipmentID) {
    return __awaiter(this, void 0, void 0, function* () {
        let modules = yield getModulesByEquipment(equipmentID);
        let hasTraining = true;
        for (let i = 0; i < modules.length; i++) {
            if (yield ModuleRepo.hasPassedModule(user.id, modules[i].id)) {
                continue;
            }
            else {
                hasTraining = false;
                break;
            }
        }
        return hasTraining;
    });
}
exports.hasTrainingModules = hasTrainingModules;
function hasAccess(uid, equipmentID) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield UserRepo.getUserByUniversityID(uid);
        return user !== undefined &&
            !(yield HoldsRepo.hasActiveHolds(user.id)) &&
            (yield hasTrainingModules(user, equipmentID));
    });
}
exports.hasAccess = hasAccess;
function getEquipmentForModule(moduleID) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("ModulesForEquipment")
            .join("Equipment", "Equipment.id", "ModulesForEquipment.equipmentID")
            .select("Equipment.*")
            .where("ModulesForEquipment.moduleID", moduleID);
    });
}
exports.getEquipmentForModule = getEquipmentForModule;
function addModulesToEquipment(id, moduleIDs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("ModulesForEquipment").insert(moduleIDs.map((trainingModule) => ({
            equipmentID: id,
            moduleID: trainingModule,
        })));
    });
}
exports.addModulesToEquipment = addModulesToEquipment;
function updateModules(id, moduleIDs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("ModulesForEquipment").del().where("equipmentID", id);
        if (moduleIDs && moduleIDs.length > 0) {
            yield addModulesToEquipment(id, moduleIDs);
        }
    });
}
exports.updateModules = updateModules;
function updateEquipment(id, equipment) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Equipment").where("id", id).update({
            name: equipment.name,
            roomID: equipment.roomID,
        });
        yield updateModules(id, equipment.moduleIDs);
        return getEquipmentByID(id);
    });
}
exports.updateEquipment = updateEquipment;
function addEquipment(equipment) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const [id] = yield (0, db_1.knex)("Equipment").insert({
            name: equipment.name,
            roomID: equipment.roomID,
            archived: true
        }, "id");
        if ((_a = equipment.moduleIDs) === null || _a === void 0 ? void 0 : _a.length)
            yield addModulesToEquipment(id, equipment.moduleIDs);
        return yield getEquipmentByID(id);
    });
}
exports.addEquipment = addEquipment;
//# sourceMappingURL=EquipmentRepository.js.map