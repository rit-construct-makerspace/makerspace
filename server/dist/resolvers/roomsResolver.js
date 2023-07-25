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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoomRepo = __importStar(require("../repositories/Rooms/RoomRepository"));
const EquipmentRepo = __importStar(require("../repositories/Equipment/EquipmentRepository"));
const UserRepo = __importStar(require("../repositories/Users/UserRepository"));
const AuditLogRepository_1 = require("../repositories/AuditLogs/AuditLogRepository");
const UserRepository_1 = require("../repositories/Users/UserRepository");
const assert_1 = __importDefault(require("assert"));
const usersSchema_1 = require("../schemas/usersSchema");
const RoomResolvers = {
    Query: {
        rooms: (_, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                return yield RoomRepo.getRooms();
            }));
        }),
        room: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield RoomRepo.getRoomByID(Number(args.id));
        }),
    },
    Room: {
        equipment: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield EquipmentRepo.getEquipmentWithRoomID(parent.id, false);
        }),
        recentSwipes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const swipes = yield RoomRepo.getRecentSwipes(parent.id);
            return swipes.map((s) => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    id: s.id,
                    dateTime: s.dateTime,
                    user: yield UserRepo.getUserByID(s.userID),
                });
            }));
        }),
    },
    Mutation: {
        addRoom: (parent, args, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.STAFF], (user) => __awaiter(void 0, void 0, void 0, function* () {
                const newRoom = yield RoomRepo.addRoom(args.room);
                yield (0, AuditLogRepository_1.createLog)("{user} created the {room} room.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: newRoom.id, label: newRoom.name });
                return newRoom;
            }));
        }),
        removeRoom: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield RoomRepo.archiveRoom(args.id);
        }),
        updateRoomName: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield RoomRepo.updateRoomName(args.id, args.name);
        }),
        swipeIntoRoom: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield RoomRepo.getRoomByID(Number(args.roomID));
            (0, assert_1.default)(room);
            const user = yield UserRepo.getUserByUniversityID(args.universityID);
            if (!user)
                return null;
            yield RoomRepo.swipeIntoRoom(Number(args.roomID), user.id);
            yield (0, AuditLogRepository_1.createLog)("{user} swiped into the {room}.", { id: user.id, label: (0, UserRepository_1.getUsersFullName)(user) }, { id: room.id, label: room.name });
            return user;
        }),
    },
};
exports.default = RoomResolvers;
//# sourceMappingURL=roomsResolver.js.map