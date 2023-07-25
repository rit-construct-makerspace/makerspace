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
exports.hasPassedModule = exports.getPassedModulesByUser = exports.updateModule = exports.addModule = exports.setModuleArchived = exports.getModuleByIDWhereArchived = exports.getModuleByID = exports.getModulesWhereArchived = exports.getModules = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
function getModules() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("TrainingModule").select();
    });
}
exports.getModules = getModules;
function getModulesWhereArchived(archived) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("TrainingModule")
            .select()
            .where({ archived: archived });
    });
}
exports.getModulesWhereArchived = getModulesWhereArchived;
function getModuleByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const trainingModule = yield (0, db_1.knex)("TrainingModule").first().where({ id });
        if (!trainingModule)
            throw new EntityNotFound_1.EntityNotFound(`Training module #${id} not found`);
        return trainingModule;
    });
}
exports.getModuleByID = getModuleByID;
function getModuleByIDWhereArchived(id, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        const trainingModule = yield (0, db_1.knex)("TrainingModule")
            .first()
            .where({
            id: id,
            archived: archived
        });
        if (!trainingModule)
            throw new EntityNotFound_1.EntityNotFound(`Training module #${id} not found`);
        return trainingModule;
    });
}
exports.getModuleByIDWhereArchived = getModuleByIDWhereArchived;
function setModuleArchived(id, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedModules = yield (0, db_1.knex)("TrainingModule")
            .where({ id: id })
            .update({ archived: archived })
            .returning("*");
        yield (0, db_1.knex)("ModulesForEquipment").delete().where({ moduleID: id });
        if (updatedModules.length < 1)
            throw new EntityNotFound_1.EntityNotFound(`Training module #${id} not found`);
        return updatedModules[0];
    });
}
exports.setModuleArchived = setModuleArchived;
function addModule(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const addedModule = yield (0, db_1.knex)("TrainingModule")
            .insert({
            name: name,
            archived: true
        }, "*");
        if (addedModule.length < 1)
            throw new EntityNotFound_1.EntityNotFound(`Could not add module ${name}`);
        return addedModule[0];
    });
}
exports.addModule = addModule;
function updateModule(id, name, quiz, reservationPrompt) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("TrainingModule")
            .where({ id })
            .update({ name, quiz: JSON.stringify(quiz), reservationPrompt: JSON.stringify(reservationPrompt) });
        return getModuleByID(id);
    });
}
exports.updateModule = updateModule;
function getPassedModulesByUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("ModuleSubmissions")
            .join("TrainingModule", "TrainingModule.id", "ModuleSubmissions.moduleID")
            .select("ModuleSubmissions.id", "ModuleSubmissions.moduleID", "TrainingModule.name as moduleName", "ModuleSubmissions.submissionDate", "ModuleSubmissions.expirationDate")
            .where("ModuleSubmissions.makerID", userID)
            .andWhere("ModuleSubmissions.passed", true);
    });
}
exports.getPassedModulesByUser = getPassedModulesByUser;
function hasPassedModule(userID, moduleID) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getPassedModulesByUser(userID)).some((passedModule) => {
            return (passedModule === null || passedModule === void 0 ? void 0 : passedModule.moduleID) === moduleID && (passedModule === null || passedModule === void 0 ? void 0 : passedModule.expirationDate) > new Date();
        });
    });
}
exports.hasPassedModule = hasPassedModule;
//# sourceMappingURL=ModuleRepository.js.map