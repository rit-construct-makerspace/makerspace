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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentSwipes = exports.swipeIntoRoom = exports.updateRoomName = exports.archiveRoom = exports.addRoom = exports.getRooms = exports.getRoomByID = void 0;
const db_1 = require("../../db");
const roomMapper_1 = require("../../mappers/rooms/roomMapper");
const assert_1 = __importDefault(require("assert"));
const EntityNotFound_1 = require("../../EntityNotFound");
function getRoomByID(roomID) {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield db_1.knex
            .first("id", "name")
            .from("Rooms")
            .where("id", roomID);
        return (0, roomMapper_1.singleRoomToDomain)(knexResult);
    });
}
exports.getRoomByID = getRoomByID;
function getRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield (0, db_1.knex)("Rooms").select("Rooms.id", "Rooms.name");
        return (0, roomMapper_1.roomsToDomain)(knexResult);
    });
}
exports.getRooms = getRooms;
function addRoom(room) {
    return __awaiter(this, void 0, void 0, function* () {
        const newID = (yield (0, db_1.knex)("Rooms").insert({
            name: room.name,
        }, "id"))[0];
        const newRoom = yield getRoomByID(newID);
        (0, assert_1.default)(newRoom);
        return newRoom;
    });
}
exports.addRoom = addRoom;
function archiveRoom(roomID) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedRooms = yield (0, db_1.knex)("Rooms").where({ id: roomID }).update({ archived: true }).returning("*");
        if (updatedRooms.length < 1)
            throw new EntityNotFound_1.EntityNotFound(`Could not find room #${roomID}`);
        return updatedRooms[0];
    });
}
exports.archiveRoom = archiveRoom;
function updateRoomName(roomID, name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Rooms").where({ id: roomID }).update({
            name: name,
        });
        return yield getRoomByID(roomID);
    });
}
exports.updateRoomName = updateRoomName;
function swipeIntoRoom(roomID, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("RoomSwipes").insert({ roomID, userID });
    });
}
exports.swipeIntoRoom = swipeIntoRoom;
function getRecentSwipes(roomID) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("RoomSwipes")
            .select()
            .where({ roomID })
            .orderBy("dateTime", "DESC")
            .limit(10);
    });
}
exports.getRecentSwipes = getRecentSwipes;
//# sourceMappingURL=RoomRepository.js.map