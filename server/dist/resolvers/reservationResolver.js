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
const ReservationRepository_1 = require("../repositories/Equipment/ReservationRepository");
const usersSchema_1 = require("../schemas/usersSchema");
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const reservationRepo = new ReservationRepository_1.ReservationRepository();
const ReservationResolvers = {
    Query: {
        reservations: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield reservationRepo.getReservations();
        }),
        reservation: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield reservationRepo.getReservationById(Number(args.id));
        })
    },
    Mutation: {
        createReservation: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            ifAllowed([usersSchema_1.Privilege.MAKER], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const eligible = yield reservationRepo.userIsEligible(args.reservation);
                const noConflicts = yield reservationRepo.noConflicts(args.reservation);
                if (eligible && noConflicts) {
                    const reservation = yield reservationRepo.createReservation(args.reservation);
                    yield (0, AuditLogRepository_1.createLog)("{user} created the {reservation} reservation.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: reservation.id, label: reservation.id.toString() });
                    return reservation;
                }
                else {
                    return null;
                }
            }));
        }),
        addComment: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MAKER], (user) => __awaiter(void 0, void 0, void 0, function* () {
                return yield reservationRepo.addComment(Number(args.resID), user.id, args.commentText);
            }));
        }),
        confirmReservation: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            ifAllowed([usersSchema_1.Privilege.MENTOR], (user) => __awaiter(void 0, void 0, void 0, function* () {
                return yield reservationRepo.confirmReservation(Number(args.resID));
            }));
        }),
        cancelReservation: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            ifAllowed([usersSchema_1.Privilege.MENTOR], (user) => __awaiter(void 0, void 0, void 0, function* () {
                return yield reservationRepo.cancelReservation(Number(args.resID));
            }));
        })
    }
};
exports.default = ReservationResolvers;
//# sourceMappingURL=reservationResolver.js.map