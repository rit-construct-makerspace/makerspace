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
exports.removeLabels = exports.setLabels = exports.addLabels = exports.archiveItem = exports.addItemAmount = exports.addItem = exports.updateItemById = exports.getItemById = exports.getItems = exports.getLabels = void 0;
const db_1 = require("../../db");
const EntityNotFound_1 = require("../../EntityNotFound");
const InventoryItemMapper_1 = require("../../mappers/store/InventoryItemMapper");
function getLabels(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield (0, db_1.knex)("InventoryItemLabel")
            .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
            .select("Label.label")
            .where("InventoryItemLabel.item", itemId);
        const result = knexResult.map((i) => i.label);
        if (result.length === 1 && result[0] === null)
            return null;
        return result;
    });
}
exports.getLabels = getLabels;
function getItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield (0, db_1.knex)("InventoryItem").select("InventoryItem.id", "InventoryItem.image", "InventoryItem.name", "InventoryItem.unit", "InventoryItem.pluralUnit", "InventoryItem.count", "InventoryItem.pricePerUnit", "InventoryItem.threshold").where('archived', false);
        return (0, InventoryItemMapper_1.inventoryItemsToDomain)(knexResult);
    });
}
exports.getItems = getItems;
function getItemById(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const knexResult = yield db_1.knex
            .first("id", "image", "name", "unit", "pluralUnit", "count", "pricePerUnit", "InventoryItem.threshold")
            .from("InventoryItem")
            .where("id", itemId);
        return (0, InventoryItemMapper_1.singleInventoryItemToDomain)(knexResult);
    });
}
exports.getItemById = getItemById;
function updateItemById(itemId, item) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("InventoryItem").where({ id: itemId }).update({
            name: item.name,
            image: item.image,
            unit: item.unit,
            pluralUnit: item.pluralUnit,
            count: item.count,
            pricePerUnit: item.pricePerUnit,
            threshold: item.threshold,
        });
        yield setLabels(itemId, item.labels);
        return yield getItemById(itemId);
    });
}
exports.updateItemById = updateItemById;
function addItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const newId = (yield (0, db_1.knex)("InventoryItem").insert({
            image: item.image,
            name: item.name,
            unit: item.unit,
            pluralUnit: item.pluralUnit,
            count: item.count,
            pricePerUnit: item.pricePerUnit,
            threshold: item.threshold,
        }, "id"))[0];
        if (item.labels && item.labels.length > 0)
            yield addLabels(newId, item.labels);
        return yield getItemById(newId);
    });
}
exports.addItem = addItem;
function addItemAmount(itemId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateItem = (yield (0, db_1.knex)("InventoryItem")
            .where({ id: itemId })
            .update({
            count: db_1.knex.raw(`?? + ${amount}`, ["count"]),
        }, "id"))[0];
        return yield getItemById(updateItem);
    });
}
exports.addItemAmount = addItemAmount;
function archiveItem(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        let updatedInventoryItems = yield (0, db_1.knex)("InventoryItem").where({ id: itemId }).update({ archived: true });
        if (updatedInventoryItems.length < 1)
            throw new EntityNotFound_1.EntityNotFound(`Could not find inventory item #${itemId}`);
        return updatedInventoryItems[0];
    });
}
exports.archiveItem = archiveItem;
function addLabels(itemId, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.knex
            .into(db_1.knex.raw("?? (??, ??)", ["InventoryItemLabel", "item", "label"]))
            .insert(db_1.knex
            .from("Label")
            .whereIn("Label.label", labels)
            .select(db_1.knex.raw("? AS ??", [itemId, "item"]), "Label.id AS label"));
    });
}
exports.addLabels = addLabels;
function setLabels(itemId, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.knex)("InventoryItemLabel").del().where({ item: itemId });
        if (labels && labels.length > 0)
            yield addLabels(itemId, labels);
    });
}
exports.setLabels = setLabels;
function removeLabels(itemId, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        const subquery = db_1.knex.select("id").from("Label").whereIn("label", labels);
        yield (0, db_1.knex)("InventoryItemLabel")
            .where("item", "=", itemId)
            .whereIn("label", subquery)
            .del();
    });
}
exports.removeLabels = removeLabels;
//# sourceMappingURL=inventoryRepository.js.map