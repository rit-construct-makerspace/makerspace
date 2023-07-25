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
exports.getLatestSubmissionByModule = exports.getLatestSubmission = exports.getSubmissionsByModule = exports.getSubmissionsByUser = exports.getSubmission = exports.addSubmission = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
function addSubmission(makerID, moduleID, passed) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, db_1.knex)("ModuleSubmissions").insert({ makerID, moduleID, passed }).returning('id');
    });
}
exports.addSubmission = addSubmission;
function getSubmission(submissionID) {
    return __awaiter(this, void 0, void 0, function* () {
        const submission = yield (0, db_1.knex)("ModuleSubmissions")
            .select()
            .where({
            id: submissionID
        })
            .first();
        if (!submission)
            throw new EntityNotFound_1.EntityNotFound("Could not find submission id ${submissionID}");
        return submission;
    });
}
exports.getSubmission = getSubmission;
function getSubmissionsByUser(makerID) {
    return __awaiter(this, void 0, void 0, function* () {
        const submission = yield (0, db_1.knex)("ModuleSubmissions")
            .select()
            .where({
            makerID: makerID,
        });
        if (!submission)
            throw new EntityNotFound_1.EntityNotFound("Could not find any submissions for this user");
        return submission;
    });
}
exports.getSubmissionsByUser = getSubmissionsByUser;
function getSubmissionsByModule(makerID, moduleID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, db_1.knex)("ModuleSubmissions")
            .select()
            .where({
            makerID: makerID,
            moduleID: moduleID
        });
    });
}
exports.getSubmissionsByModule = getSubmissionsByModule;
function getLatestSubmission(makerID) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield (0, db_1.knex)("ModuleSubmissions")
            .where("makerID", makerID)
            .orderBy("submissionDate", "desc")
            .first();
        return res;
    });
}
exports.getLatestSubmission = getLatestSubmission;
function getLatestSubmissionByModule(makerID, moduleID) {
    return __awaiter(this, void 0, void 0, function* () {
        const submission = yield (0, db_1.knex)("ModuleSubmissions")
            .where("makerID", makerID)
            .andWhere("moduleID", moduleID)
            .orderBy("submissionDate", "desc")
            .first();
        return submission;
    });
}
exports.getLatestSubmissionByModule = getLatestSubmissionByModule;
//# sourceMappingURL=SubmissionRepository.js.map