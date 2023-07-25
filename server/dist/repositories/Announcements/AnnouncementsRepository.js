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
exports.createAnnouncement = exports.getAnnouncementByID = exports.getAnnouncements = void 0;
const EntityNotFound_1 = require("../../EntityNotFound");
const db_1 = require("../../db");
function getAnnouncements() {
    return (0, db_1.knex)('Announcements').select()
        .whereRaw('"expDate" > CURRENT_TIMESTAMP');
}
exports.getAnnouncements = getAnnouncements;
function getAnnouncementByID(announcementID) {
    return __awaiter(this, void 0, void 0, function* () {
        const announcement = yield (0, db_1.knex)("Announcements").first().where("id", announcementID);
        if (!announcement)
            throw new EntityNotFound_1.EntityNotFound(`Announcement #${announcementID} not found`);
        return announcement;
    });
}
exports.getAnnouncementByID = getAnnouncementByID;
function createAnnouncement(announcement) {
    return __awaiter(this, void 0, void 0, function* () {
        const [newID] = yield (0, db_1.knex)("Announcements").insert(announcement, "id");
        return yield getAnnouncementByID(newID);
    });
}
exports.createAnnouncement = createAnnouncement;
//# sourceMappingURL=AnnouncementsRepository.js.map