"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleRoomToDomain = exports.roomsToDomain = void 0;
function roomsToDomain(raw) {
    return raw.map((i) => {
        return singleRoomToDomain(i);
    });
}
exports.roomsToDomain = roomsToDomain;
function singleRoomToDomain(raw) {
    if (!raw)
        return null;
    return {
        id: raw.id,
        name: raw.name,
    };
}
exports.singleRoomToDomain = singleRoomToDomain;
//# sourceMappingURL=roomMapper.js.map