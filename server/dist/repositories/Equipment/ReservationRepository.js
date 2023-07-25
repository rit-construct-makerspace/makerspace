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
exports.ReservationRepository = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
class ReservationRepository {
    constructor(queryBuilder) {
        this.queryBuilder = queryBuilder || db_1.knex;
    }
    getReservationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield (0, db_1.knex)("Reservations").where({ id }).first();
            if (!reservation)
                throw new EntityNotFound_1.EntityNotFound("Could not find reservation #${id}");
            return reservation;
        });
    }
    getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.knex)("Reservations").select();
        });
    }
    userIsEligible(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = (yield this.queryBuilder("ModulesForEquipment")
                .select("trainingModuleId")
                .where("equipmentId", reservation.equipmentID));
            let passed = true;
            modules.forEach((module) => __awaiter(this, void 0, void 0, function* () {
                const eligibility = yield this.queryBuilder("ModuleSubmissions")
                    .select("passed")
                    .where("moduleID", module.id)
                    .where("makerID", reservation.makerID)
                    .orderBy("submissionDate", "desc")
                    .limit(1)
                    .first();
                if (!eligibility) {
                    passed = false;
                }
            }));
            return passed;
        });
    }
    noConflicts(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            const conflicts = yield this.queryBuilder("Reservations")
                .select()
                .whereBetween("startTime", [reservation.startTime, reservation.endTime])
                .orWhereBetween("endTime", [reservation.startTime, reservation.endTime])
                .orWhereBetween(reservation.startTime, ["startTime", "endTime"])
                .orWhereBetween(reservation.endTime, ["startTime", "endTime"])
                .as('t')
                .count("t.* as count");
            if (conflicts == 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    createReservation(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newId] = (yield this.queryBuilder("Reservations").insert({
                makerID: reservation.makerID,
                equipmentID: reservation.equipmentID,
                startTime: reservation.startTime,
                endTime: reservation.endTime
            }, "id"));
            yield this.addComment(newId, reservation.makerID, reservation.startingMakerComment);
            return this.getReservationById(newId);
        });
    }
    addComment(resID, authorId, commentText) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newId] = (yield this.queryBuilder("ReservationEvents").insert({
                eventType: "COMMENT",
                reservationID: resID,
                userID: authorId,
                payload: commentText
            }, "id"));
            const commentID = yield (0, db_1.knex)("ReservationEvents").where({ id: newId }).first();
            if (!commentID)
                throw new EntityNotFound_1.EntityNotFound("Could not find comment #${newId}");
            return commentID;
        });
    }
    confirmReservation(resID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queryBuilder("Reservations")
                .where("id", resID)
                .update({ status: "CONFIRMED", lastUpdated: Date.now() });
            return this.getReservationById(resID);
        });
    }
    cancelReservation(resID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queryBuilder("Reservations")
                .where("id", resID)
                .update({ status: "CANCELLED", lastUpdated: Date.now() });
            return this.getReservationById(resID);
        });
    }
}
exports.ReservationRepository = ReservationRepository;
//# sourceMappingURL=ReservationRepository.js.map