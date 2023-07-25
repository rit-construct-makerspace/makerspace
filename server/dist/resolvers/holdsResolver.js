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
const usersSchema_1 = require("../schemas/usersSchema");
const HoldsRepo = __importStar(require("../repositories/Holds/HoldsRepository"));
const UsersRepo = __importStar(require("../repositories/Users/UserRepository"));
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const HoldsResolvers = {
    Hold: {
        creator: (parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return UsersRepo.getUserByID(parent.creatorID);
            }));
        }),
        remover: (parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () { return parent.removerID && UsersRepo.getUserByID(parent.removerID); }));
        }),
    },
    Mutation: {
        createHold: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const userWithHold = yield UsersRepo.getUserByID(Number(args.userID));
                yield (0, AuditLogRepository_1.createLog)("{user} placed a hold on {user}'s account.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: Number(args.userID), label: (0, UserRepository_1.getUsersFullName)(userWithHold) });
                return HoldsRepo.createHold(user.id, Number(args.userID), args.description);
            }));
        }),
        removeHold: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const hold = yield HoldsRepo.getHold(Number(args.holdID));
                const userWithHold = yield UsersRepo.getUserByID(hold.userID);
                yield (0, AuditLogRepository_1.createLog)("{user} removed a hold on {user}'s account.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: userWithHold.id, label: (0, UserRepository_1.getUsersFullName)(userWithHold) });
                return HoldsRepo.removeHold(Number(args.holdID), user.id);
            }));
        }),
    },
};
exports.default = HoldsResolvers;
//# sourceMappingURL=holdsResolver.js.map