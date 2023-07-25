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
const UserRepo = __importStar(require("../../repositories/Users/UserRepository"));
const tables = ["Users"];
describe("UserRepository tests", () => {
    beforeAll(() => {
        return db_1.knex.migrate.latest();
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const t of tables) {
                yield (0, db_1.knex)(t).del();
            }
        }
        catch (error) {
            fail("Failed setup");
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const t of tables) {
                yield (0, db_1.knex)(t).del();
            }
            yield db_1.knex.destroy();
        }
        catch (error) {
            fail("Failed teardown");
        }
    }));
    test("getUsers with no rows", () => __awaiter(void 0, void 0, void 0, function* () {
        let userRows = yield UserRepo.getUsers();
        expect(userRows.length).toBe(0);
    }));
    test("addUser and get", () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com"
        });
        let userRows = yield UserRepo.getUsers();
        expect(userRows.length).toBe(1);
    }));
    test("addUser and get", () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com"
        });
        let userRows = yield UserRepo.getUsers();
        expect(userRows.length).toBe(1);
    }));
    test("getUserByID", () => __awaiter(void 0, void 0, void 0, function* () {
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com"
        })).id;
        let user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
    }));
});
//# sourceMappingURL=userRepo.test.js.map