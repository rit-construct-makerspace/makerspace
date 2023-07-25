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
const ModuleRepo = __importStar(require("../repositories/Training/ModuleRepository"));
const usersSchema_1 = require("../schemas/usersSchema");
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const SubmissionRepo = __importStar(require("../repositories/Training/SubmissionRepository"));
const constants_1 = require("../constants");
const EquipmentRepo = __importStar(require("../repositories/Equipment/EquipmentRepository"));
const removeAnswersFromQuiz = (quiz) => {
    for (let item of quiz) {
        if (item.options) {
            for (let option of item.options) {
                delete option.correct;
            }
        }
    }
};
function submittedOptionIDsCorrect(correct, submitted) {
    if (!submitted || correct.length !== submitted.length)
        return false;
    for (let i = 0; i < correct.length; i++) {
        if (correct[i] !== submitted[i])
            return false;
    }
    return true;
}
const TrainingModuleResolvers = {
    Query: {
        modules: (_parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MAKER, usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                let modules = yield ModuleRepo.getModulesWhereArchived(false);
                if (user.privilege === "MAKER")
                    for (let module of modules)
                        removeAnswersFromQuiz(module.quiz);
                return modules;
            }));
        }),
        module: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MAKER, usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                let module = yield ModuleRepo.getModuleByIDWhereArchived(args.id, false);
                if (user.privilege === "MAKER")
                    removeAnswersFromQuiz(module.quiz);
                return module;
            }));
        }),
        archivedModules: (_parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (_user) => __awaiter(void 0, void 0, void 0, function* () {
                let modules = yield ModuleRepo.getModulesWhereArchived(true);
                return modules;
            }));
        }),
        archivedModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (_user) => __awaiter(void 0, void 0, void 0, function* () {
                let module = yield ModuleRepo.getModuleByIDWhereArchived(args.id, true);
                return module;
            }));
        }),
    },
    TrainingModule: {
        equipment: (parent, _, { ifAuthenticated }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAuthenticated((user) => __awaiter(void 0, void 0, void 0, function* () {
                return EquipmentRepo.getEquipmentForModule(parent.id);
            }));
        })
    },
    Mutation: {
        createModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const module = yield ModuleRepo.addModule(args.name);
                yield (0, AuditLogRepository_1.createLog)("{user} created the {module} module.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: module.id, label: module.name });
                return module;
            }));
        }),
        updateModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const module = yield ModuleRepo.updateModule(Number(args.id), args.name, args.quiz, args.reservationPrompt);
                yield (0, AuditLogRepository_1.createLog)("{user} updated the {module} module.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: module.id, label: module.name });
            }));
        }),
        archiveModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const module = yield ModuleRepo.setModuleArchived(Number(args.id), true);
                yield (0, AuditLogRepository_1.createLog)("{user} archived the {module} module.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: module.id, label: module.name });
                return module;
            }));
        }),
        publishModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const module = yield ModuleRepo.setModuleArchived(Number(args.id), false);
                yield (0, AuditLogRepository_1.createLog)("{user} archived the {module} module.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: module.id, label: module.name });
                return module;
            }));
        }),
        submitModule: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MAKER, usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const module = yield ModuleRepo.getModuleByIDWhereArchived(Number(args.moduleID), false);
                if (!module || module.archived) {
                    throw Error(`Cannot access module #${args.moduleID}`);
                }
                if (module.quiz.length === 0) {
                    throw Error("Provided module has no questions");
                }
                let correct = 0;
                let incorrect = 0;
                const questions = module.quiz.filter((i) => ["CHECKBOXES", "MULTIPLE_CHOICE"].includes(i.type));
                for (let question of questions) {
                    if (!question.options)
                        throw Error(`Module Item ${question.id} of type ${question.type} has no options`);
                    const correctOptionIDs = question.options
                        .filter((o) => o.correct)
                        .map((o) => o.id);
                    const submittedOptionIDs = (_a = args.answerSheet.find((item) => item.itemID === question.id)) === null || _a === void 0 ? void 0 : _a.optionIDs;
                    submittedOptionIDsCorrect(correctOptionIDs, submittedOptionIDs)
                        ? correct++
                        : incorrect++;
                }
                const grade = (correct / (incorrect + correct)) * 100;
                SubmissionRepo.addSubmission(user.id, Number(args.moduleID), grade >= constants_1.MODULE_PASSING_THRESHOLD).then((id) => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, AuditLogRepository_1.createLog)(`{user} submitted attempt of {module} with a grade of ${grade}.`, { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: args.moduleID, label: module.name });
                    return id;
                }));
            }));
        }),
    },
};
exports.default = TrainingModuleResolvers;
//# sourceMappingURL=trainingModuleResolver.js.map