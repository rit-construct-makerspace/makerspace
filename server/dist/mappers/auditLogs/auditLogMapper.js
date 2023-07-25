"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleLogToDomain = exports.logsToDomain = void 0;
function logsToDomain(raw) {
    return raw.map((i) => {
        return singleLogToDomain(i);
    });
}
exports.logsToDomain = logsToDomain;
function singleLogToDomain(raw) {
    if (!raw)
        return null;
    return {
        id: raw.id,
        dateTime: raw.dateTime,
        message: raw.message,
    };
}
exports.singleLogToDomain = singleLogToDomain;
//# sourceMappingURL=auditLogMapper.js.map