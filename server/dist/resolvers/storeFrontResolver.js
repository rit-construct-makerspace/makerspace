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
const InventoryRepo = __importStar(require("../repositories/Store/inventoryRepository"));
const LabelRepo = __importStar(require("../repositories/Store/labelRepository"));
const usersSchema_1 = require("../schemas/usersSchema");
const StorefrontResolvers = {
    Query: {
        InventoryItems: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield InventoryRepo.getItems();
        }),
        InventoryItem: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield InventoryRepo.getItemById(Number(args.id));
        }),
        Labels: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield LabelRepo.getAllLabels();
        }),
    },
    InventoryItem: {
        labels: (parent) => {
            return InventoryRepo.getLabels(parent.id);
        },
    },
    Mutation: {
        createInventoryItem: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield InventoryRepo.addItem(args.item);
            }));
        }),
        updateInventoryItem: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return yield InventoryRepo.updateItemById(Number(args.itemId), args.item);
            }));
        }),
        addItemAmount: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return InventoryRepo.addItemAmount(Number(args.itemId), args.count);
            }));
        }),
        removeItemAmount: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return InventoryRepo.addItemAmount(Number(args.itemID), args.count * -1);
            }));
        }),
        archiveInventoryItem: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                return InventoryRepo.archiveItem(Number(args.itemID));
            }));
        }),
        createLabel: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                yield LabelRepo.addLabel(args.label);
            }));
        }),
        archiveLabel: (_, args, context, { ifAllowed }) => __awaiter(void 0, void 0, void 0, function* () {
            return ifAllowed([usersSchema_1.Privilege.MENTOR, usersSchema_1.Privilege.STAFF], () => __awaiter(void 0, void 0, void 0, function* () {
                yield LabelRepo.archiveLabel(args.label);
            }));
        }),
    },
};
exports.default = StorefrontResolvers;
//# sourceMappingURL=storeFrontResolver.js.map