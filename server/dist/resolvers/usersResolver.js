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
const UserRepo = __importStar(require("../repositories/Users/UserRepository"));
const ModuleRepo = __importStar(require("../repositories/Training/ModuleRepository"));
const HoldsRepo = __importStar(require("../repositories/Holds/HoldsRepository"));
const usersSchema_1 = require("../schemas/usersSchema");
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const UsersResolvers = {
    User: {
        holds: (parent, _args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return HoldsRepo.getHoldsByUser(Number(parent.id));
        }),
        passedModules: (parent, _args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return ModuleRepo.getPassedModulesByUser(Number(parent.id));
        }),
    },
    Query: {
        users: (_parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield UserRepo.getUsers();
            }));
        }),
        user: (_parent, args, { ifAllowedOrSelf }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowedOrSelf(Number(args.id), [usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield UserRepo.getUserByID(Number(args.id));
            }));
        }),
        currentUser: (_parent, _args, { user, ifAuthenticated }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAuthenticated(() => __awaiter(void 0, void 0, void 0, function* () {
                return user;
            }));
        }),
    },
    Mutation: {
        createUser: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield UserRepo.createUser(args);
            }));
        }),
        updateStudentProfile: (_, args, { ifAllowedOrSelf }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowedOrSelf(Number(args.userID), [usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                return yield UserRepo.updateStudentProfile({
                    userID: Number(args.userID),
                    pronouns: args.pronouns,
                    college: args.college,
                    expectedGraduation: args.expectedGraduation,
                    universityID: args.universityID
                });
            }));
        }),
        setPrivilege: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (executingUser) => __awaiter(void 0, void 0, void 0, function* () {
                const userSubject = yield UserRepo.setPrivilege(Number(args.userID), args.privilege);
                yield (0, AuditLogRepository_1.createLog)(`{user} set {user}'s access level to ${args.privilege}.`, { id: executingUser.id, label: (0, UserRepository_1.getUsersFullName)(executingUser) }, { id: userSubject.id, label: (0, UserRepository_1.getUsersFullName)(userSubject) });
            }));
        }),
        archiveUser: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const userSubject = yield UserRepo.getUserByID(Number(args.userID));
                yield (0, AuditLogRepository_1.createLog)(`{user} archived {user}'s profile.`, { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: args.userID, label: (0, UserRepository_1.getUsersFullName)(userSubject) });
                return yield UserRepo.archiveUser(Number(args.userID));
            }));
        }),
    }
};
exports.default = UsersResolvers;
//# sourceMappingURL=usersResolver.js.map