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
const EquipmentRepo = __importStar(require("../repositories/Equipment/EquipmentRepository"));
const RoomRepo = __importStar(require("../repositories/Rooms/RoomRepository"));
const ReservationRepository_1 = require("../repositories/Equipment/ReservationRepository");
const usersSchema_1 = require("../schemas/usersSchema");
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const reservationRepo = new ReservationRepository_1.ReservationRepository();
const EquipmentResolvers = {
    Query: {
        equipments: (_parent, _args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield EquipmentRepo.getEquipmentWhereArchived(false);
        }),
        equipment: (_parent, args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), false);
        }),
        archivedEquipments: (_parent, _args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield EquipmentRepo.getEquipmentWhereArchived(true);
            }));
        }),
        archivedEquipment: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield EquipmentRepo.getEquipmentByIDWhereArchived(Number(args.id), true);
            }));
        }),
        reservations: (_parent, _args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield reservationRepo.getReservations();
        }),
        reservation: (_parent, args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield reservationRepo.getReservationById(Number(args.id));
        }),
    },
    Equipment: {
        room: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield RoomRepo.getRoomByID(parent.roomID);
        }),
        hasAccess: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield EquipmentRepo.hasAccess(args.uid, parent.id);
        }),
        trainingModules: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield EquipmentRepo.getModulesByEquipment(parent.id);
        }),
    },
    Mutation: {
        addEquipment: (_parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const equipment = yield EquipmentRepo.addEquipment(args.equipment);
                yield (0, AuditLogRepository_1.createLog)("{user} created the {equipment} equipment.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: equipment.id, label: equipment.name });
                return equipment;
            }));
        }),
        updateEquipment: (_, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield EquipmentRepo.updateEquipment(Number(args.id), args.equipment);
            }));
        }),
        archiveEquipment: (_, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield EquipmentRepo.setEquipmentArchived(args.id, true);
            }));
        }),
        publishEquipment: (_, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield EquipmentRepo.setEquipmentArchived(args.id, false);
            }));
        }),
    },
};
exports.default = EquipmentResolvers;
//# sourceMappingURL=equipmentResolver.js.map