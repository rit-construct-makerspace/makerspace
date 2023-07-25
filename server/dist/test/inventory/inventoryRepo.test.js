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
const db_1 = require("../../db");
const InventoryRepo = __importStar(require("../../repositories/Store/inventoryRepository"));
const LabelRepo = __importStar(require("../../repositories/Store/labelRepository"));
const tables = ["InventoryItem", "Label", "InventoryItemLabel"];
describe("InventoryRepository test set", () => {
    beforeAll(() => {
        return db_1.knex.migrate.latest();
    });
    beforeEach(() => {
        try {
            tables.forEach((t) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, db_1.knex)(t).del();
            }));
        }
        catch (error) {
            fail("Failed setup");
        }
    });
    afterAll(() => {
        try {
            tables.forEach((t) => __awaiter(void 0, void 0, void 0, function* () {
                (0, db_1.knex)(t).del();
            }));
            db_1.knex.destroy();
        }
        catch (error) {
            fail("Failed teardown");
        }
    });
    test("getAllInventoryItems with no items", () => __awaiter(void 0, void 0, void 0, function* () {
        let items = yield InventoryRepo.getItems();
        expect(items.length).toBe(0);
    }));
    test("getAllInventoryItems with one item", () => __awaiter(void 0, void 0, void 0, function* () {
        let item = {
            id: 0,
            count: 10,
            image: "url",
            labels: [],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        yield InventoryRepo.addItem(item);
        let items = yield InventoryRepo.getItems();
        expect(items.length).toBe(1);
        expect(items[0].name).toBe(item.name);
        expect(items[0].count).toBe(item.count);
        expect(items[0].image).toBe(item.image);
        expect(items[0].pluralUnit).toBe(item.pluralUnit);
        expect(items[0].pricePerUnit).toBe(item.pricePerUnit);
        expect(items[0].unit).toBe(item.unit);
        expect(items[0].threshold).toBe(item.threshold);
    }));
    test("getAllInventoryItems with three items", () => __awaiter(void 0, void 0, void 0, function* () {
        let item = {
            id: 0,
            count: 10,
            image: "url",
            labels: [],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        yield InventoryRepo.addItem(item);
        yield InventoryRepo.addItem(item);
        yield InventoryRepo.addItem(item);
        let items = yield InventoryRepo.getItems();
        expect(items.length).toBe(3);
    }));
    test("getInventoryItemsById with no items", () => __awaiter(void 0, void 0, void 0, function* () {
        let item = yield InventoryRepo.getItemById(0);
        expect(item).toBe(null);
    }));
    test("updateItemById", () => __awaiter(void 0, void 0, void 0, function* () {
        let item = {
            count: 10,
            image: "url",
            labels: [],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        let itemOutput = yield InventoryRepo.addItem(item);
        if (itemOutput !== null) {
            item.count = 50;
            item.image = "test";
            item.name = "testtest";
            let final = yield InventoryRepo.updateItemById(itemOutput.id, item);
            expect(final === null || final === void 0 ? void 0 : final.count).toBe(50);
            expect(final === null || final === void 0 ? void 0 : final.image).toBe("test");
            expect(final === null || final === void 0 ? void 0 : final.name).toBe("testtest");
        }
        else {
            fail("addItem returned null");
        }
    }));
    test("archiveItemById", () => __awaiter(void 0, void 0, void 0, function* () {
        let item1 = {
            count: 10,
            image: "url",
            labels: [],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        let item2 = {
            count: 11,
            image: "url2",
            labels: [],
            name: "test2",
            pluralUnit: "feet2",
            pricePerUnit: 5.52,
            unit: "foot2",
            threshold: 0,
        };
        let item1Output = yield InventoryRepo.addItem(item1);
        let item2Output = yield InventoryRepo.addItem(item2);
        if (item1Output !== null) {
            let final = yield InventoryRepo.archiveItem(item1Output.id);
            let items = yield InventoryRepo.getItems();
            expect(items.length).toBe(1);
            expect(items[0].id).toBe(item2Output === null || item2Output === void 0 ? void 0 : item2Output.id);
        }
        else {
            fail("addItem returned null");
        }
    }));
    test("addLabels", () => __awaiter(void 0, void 0, void 0, function* () {
        yield LabelRepo.addLabel("Test-label");
        yield LabelRepo.addLabel("Test-label2");
        let item1 = {
            count: 10,
            image: "url",
            labels: ["Test-label"],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        let item1Output = yield InventoryRepo.addItem(item1);
        if (item1Output !== null) {
            yield InventoryRepo.addLabels(item1Output.id, ["Test-label2"]);
            let labels = yield InventoryRepo.getLabels(item1Output.id);
            expect(labels).toContain("Test-label2");
            expect(labels).toContain("Test-label");
        }
        else {
            fail("addItem returned null");
        }
    }));
    test("removeLabels", () => __awaiter(void 0, void 0, void 0, function* () {
        yield LabelRepo.addLabel("Test-label");
        yield LabelRepo.addLabel("Test-label2");
        let item1 = {
            count: 10,
            image: "url",
            labels: ["Test-label", "Test-label2"],
            name: "test",
            pluralUnit: "feet",
            pricePerUnit: 5.5,
            unit: "foot",
            threshold: 0,
        };
        let item1Output = yield InventoryRepo.addItem(item1);
        if (item1Output !== null) {
            yield InventoryRepo.removeLabels(item1Output.id, ["Test-label2"]);
            let labels = yield InventoryRepo.getLabels(item1Output.id);
            expect(labels).not.toContain("Test-label2");
            expect(labels).toContain("Test-label");
        }
        else {
            fail("addItem returned null");
        }
    }));
});
//# sourceMappingURL=inventoryRepo.test.js.map