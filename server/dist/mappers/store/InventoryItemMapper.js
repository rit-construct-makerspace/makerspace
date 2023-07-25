"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleInventoryItemToDomain = exports.inventoryItemsToDomain = void 0;
function inventoryItemsToDomain(raw) {
    return raw.map((i) => {
        return singleInventoryItemToDomain(i);
    });
}
exports.inventoryItemsToDomain = inventoryItemsToDomain;
function singleInventoryItemToDomain(raw) {
    if (!raw)
        return null;
    return {
        id: raw.id,
        image: raw.image,
        name: raw.name,
        unit: raw.unit,
        pluralUnit: raw.pluralUnit,
        count: raw.count,
        pricePerUnit: raw.pricePerUnit,
        threshold: raw.threshold,
    };
}
exports.singleInventoryItemToDomain = singleInventoryItemToDomain;
//# sourceMappingURL=InventoryItemMapper.js.map