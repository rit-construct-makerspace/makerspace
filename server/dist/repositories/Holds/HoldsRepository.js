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
exports.hasActiveHolds = exports.getHoldsByUser = exports.removeHold = exports.createHold = exports.getHold = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
function getHold(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const hold = yield (0, db_1.knex)("Holds").first().where({ id });
        if (!hold)
            throw new EntityNotFound_1.EntityNotFound(`Hold #${id} not found`);
        return hold;
    });
}
exports.getHold = getHold;
function createHold(creatorID, userID, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const [holdID] = yield (0, db_1.knex)("Holds").insert({
            creatorID,
            userID,
            description: description,
        }, "id");
        return getHold(holdID);
    });
}
exports.createHold = createHold;
function removeHold(holdID, removerID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Holds")
            .update({
            removerID,
            removeDate: db_1.knex.fn.now(),
        })
            .where({ id: holdID });
        return getHold(holdID);
    });
}
exports.removeHold = removeHold;
function getHoldsByUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, db_1.knex)("Holds").select().where({ userID }).orderBy("createDate", "DESC");
    });
}
exports.getHoldsByUser = getHoldsByUser;
function hasActiveHolds(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getHoldsByUser(userID)).some((hold) => {
            return !hold.removeDate || hold.removeDate > new Date();
        });
    });
}
exports.hasActiveHolds = hasActiveHolds;
//# sourceMappingURL=HoldsRepository.js.map