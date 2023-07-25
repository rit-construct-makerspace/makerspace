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
exports.archiveUser = exports.setPrivilege = exports.updateStudentProfile = exports.createUser = exports.getUserByUniversityID = exports.getUserByRitUsername = exports.getUserByID = exports.getUsers = exports.hashUniversityID = exports.getUsersFullName = void 0;
const db_1 = require("../../db");
const AuditLogRepository_1 = require("../AuditLogs/AuditLogRepository");
const EntityNotFound_1 = require("../../EntityNotFound");
const crypto_1 = require("crypto");
function getUsersFullName(user) {
    return `${user.firstName} ${user.lastName}`;
}
exports.getUsersFullName = getUsersFullName;
function hashUniversityID(universityID) {
    return (0, crypto_1.createHash)("sha256").update(universityID).digest("hex");
}
exports.hashUniversityID = hashUniversityID;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("Users").select();
    });
}
exports.getUsers = getUsers;
function getUserByID(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, db_1.knex)("Users").first().where("id", userID);
        if (!user)
            throw new EntityNotFound_1.EntityNotFound(`User #${userID} not found`);
        return user;
    });
}
exports.getUserByID = getUserByID;
function getUserByRitUsername(ritUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("Users").first().where("ritUsername", ritUsername);
    });
}
exports.getUserByRitUsername = getUserByRitUsername;
function getUserByUniversityID(universityID) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedUniversityID = hashUniversityID(universityID);
        return (0, db_1.knex)("Users").first().where({ universityID: hashedUniversityID });
    });
}
exports.getUserByUniversityID = getUserByUniversityID;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const [newID] = yield (0, db_1.knex)("Users").insert(user, "id");
        return yield getUserByID(newID);
    });
}
exports.createUser = createUser;
function updateStudentProfile(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUserByID(args.userID);
        if (!user.setupComplete) {
            yield (0, AuditLogRepository_1.createLog)("{user} has joined The Construct!", {
                id: args.userID,
                label: getUsersFullName(user),
            });
        }
        yield (0, db_1.knex)("Users").where({ id: args.userID }).update({
            pronouns: args.pronouns,
            college: args.college,
            expectedGraduation: args.expectedGraduation,
            universityID: hashUniversityID(args.universityID),
            setupComplete: true,
        });
        return getUserByID(args.userID);
    });
}
exports.updateStudentProfile = updateStudentProfile;
function setPrivilege(userID, privilege) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Users").where({ id: userID }).update({ privilege });
        return yield getUserByID(userID);
    });
}
exports.setPrivilege = setPrivilege;
function archiveUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Users").where({ id: userID }).update({ archived: true });
        return yield getUserByID(userID);
    });
}
exports.archiveUser = archiveUser;
//# sourceMappingURL=UserRepository.js.map