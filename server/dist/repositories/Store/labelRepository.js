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
exports.archiveLabelById = exports.archiveLabel = exports.addLabel = exports.getLabelsForItem = exports.getAllLabels = void 0;
const db_1 = require("../../db");
function getAllLabels() {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield (0, db_1.knex)("Label").select("label");
        return knexResult.map((i) => i.label);
    });
}
exports.getAllLabels = getAllLabels;
function getLabelsForItem(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.knex)("InventoryItem")
            .leftJoin("InventoryItemLabel", "InventoryItemLabel.item", "=", "InventoryItem.id")
            .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
            .select("Label.label")
            .where("InventoryItem.id", itemId);
    });
}
exports.getLabelsForItem = getLabelsForItem;
function addLabel(label) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Label").insert({ label });
    });
}
exports.addLabel = addLabel;
function archiveLabel(label) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Label").where({ label }).update({ archived: true });
    });
}
exports.archiveLabel = archiveLabel;
function archiveLabelById(labelId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("Label").where({ id: labelId }).update({ archived: true });
    });
}
exports.archiveLabelById = archiveLabelById;
//# sourceMappingURL=labelRepository.js.map