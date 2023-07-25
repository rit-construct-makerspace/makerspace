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
exports.getLogs = exports.createLog = void 0;
const db_1 = require("../../db");
const auditLogMapper_1 = require("../../mappers/auditLogs/auditLogMapper");
function createLog(message, ...entities) {
    return __awaiter(this, void 0, void 0, function* () {
        let formattedMessage = message;
        entities.forEach(({ id, label }) => {
            var _a;
            const entityType = (_a = formattedMessage.match(/{(\w+)}/)) === null || _a === void 0 ? void 0 : _a[1];
            formattedMessage = formattedMessage.replace(/{\w+}/, `<${entityType}:${id}:${label}>`);
        });
        yield (0, db_1.knex)("AuditLogs").insert({ message: formattedMessage });
    });
}
exports.createLog = createLog;
function getLogs(startDate, stopDate, searchText) {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield (0, db_1.knex)("AuditLogs")
            .select()
            .whereBetween("dateTime", [startDate, stopDate])
            .where("message", "ilike", `%${searchText}%`)
            .orderBy("dateTime", "DESC");
        return (0, auditLogMapper_1.logsToDomain)(knexResult);
    });
}
exports.getLogs = getLogs;
//# sourceMappingURL=AuditLogRepository.js.map