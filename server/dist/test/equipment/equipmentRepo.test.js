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
const EquipmentRepo = __importStar(require("../../repositories/Equipment/EquipmentRepository"));
const RoomRepo = __importStar(require("../../repositories/Rooms/RoomRepository"));
const ModuleRepo = __importStar(require("../../repositories/Training/ModuleRepository"));
const SubmissionRepo = __importStar(require("../../repositories/Training/SubmissionRepository"));
const UserRepo = __importStar(require("../../repositories/Users/UserRepository"));
const Holdsrepo = __importStar(require("../../repositories/Holds/HoldsRepository"));
const UserRepository_1 = require("../../repositories/Users/UserRepository");
const tables = ["ModuleSubmissions", "ModulesForEquipment", "Equipment", "TrainingModule", "Holds", "Rooms", "Users"];
const testRoom = {
    id: 0,
    name: "Test Room"
};
describe("EquipmentRepository tests", () => {
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
    test("getEquipments with no rows", () => __awaiter(void 0, void 0, void 0, function* () {
        let equipmentRows = yield EquipmentRepo.getEquipment();
        expect(equipmentRows.length).toBe(0);
    }));
    test("addEquipment and get", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentData = yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        });
        let equipmentRows = yield EquipmentRepo.getEquipment();
        expect(equipmentRows.length).toBe(1);
        expect(equipmentRows[0]).toEqual(equipmentData);
    }));
    test("getEquipmentByID", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        let equipmentRow = yield EquipmentRepo.getEquipmentByID(equipmentID);
        expect(equipmentRow).toBeDefined();
    }));
    test("updateEquipment", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        yield EquipmentRepo.updateEquipment(equipmentID, {
            name: "Test Equipment Updated",
            roomID: roomID,
            moduleIDs: []
        });
        expect((yield EquipmentRepo.getEquipmentByID(equipmentID)).name).toBe("Test Equipment Updated");
    }));
    test("archiveEquipment", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        let targetEquipment = yield EquipmentRepo.getEquipmentByID(equipmentID);
        expect(targetEquipment).toBeDefined();
        yield EquipmentRepo.setEquipmentArchived(equipmentID, true);
        expect((yield EquipmentRepo.getEquipmentByID(equipmentID)).archived).toBe(true);
        expect((yield EquipmentRepo.getEquipmentWhereArchived(false)).map((equipment) => equipment.id)).not.toContainEqual(targetEquipment.id);
        expect((yield EquipmentRepo.getEquipmentWhereArchived(true)).map((equipment) => equipment.id)).toContainEqual(targetEquipment.id);
    }));
    test("addModulesToEquipment and get", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        const moduleID = (yield ModuleRepo.addModule("Test Module")).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        yield EquipmentRepo.addModulesToEquipment(equipmentID, [moduleID]);
        const modules = yield EquipmentRepo.getModulesByEquipment(equipmentID);
        expect(modules.length).toBe(1);
        expect(modules[0].name).toBe("Test Module");
    }));
    test("updateModules", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        const moduleOneID = (yield ModuleRepo.addModule("Test Module I")).id;
        const moduleTwoID = (yield ModuleRepo.addModule("Test Module II")).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        yield EquipmentRepo.addModulesToEquipment(equipmentID, [moduleOneID]);
        const modulesPreUpdate = yield EquipmentRepo.getModulesByEquipment(equipmentID);
        expect(modulesPreUpdate.length).toBe(1);
        expect(modulesPreUpdate[0].name).toBe("Test Module I");
        yield EquipmentRepo.updateModules(equipmentID, [moduleTwoID]);
        const modulesPostUpdate = yield EquipmentRepo.getModulesByEquipment(equipmentID);
        expect(modulesPostUpdate.length).toBe(1);
        expect(modulesPostUpdate[0].name).toBe("Test Module II");
    }));
    test("hasAcccess no modules", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com",
        })).id;
        const uid = "000000000";
        const user = yield UserRepo.updateStudentProfile({
            userID: userID,
            pronouns: "he/him",
            college: "Test College",
            expectedGraduation: "2050",
            universityID: uid
        });
        expect(user.universityID).toBe((0, UserRepository_1.hashUniversityID)(uid));
        expect(yield EquipmentRepo.hasAccess(uid, equipmentID)).toBe(true);
    }));
    test("hasAcccess bad swipe", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com",
        })).id;
        const uid = "000000000";
        const user = yield UserRepo.updateStudentProfile({
            userID: userID,
            pronouns: "he/him",
            college: "Test College",
            expectedGraduation: "2050",
            universityID: uid
        });
        expect(user.universityID).toBe((0, UserRepository_1.hashUniversityID)(uid));
        yield Holdsrepo.createHold(userID, userID, "Test Hold");
        expect(yield EquipmentRepo.hasAccess("111111111", equipmentID)).toBe(false);
    }));
    test("hasAcccess with one module", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com",
        })).id;
        const uid = "000000000";
        const user = yield UserRepo.updateStudentProfile({
            userID: userID,
            pronouns: "he/him",
            college: "Test College",
            expectedGraduation: "2050",
            universityID: uid
        });
        expect(user.universityID).toBe((0, UserRepository_1.hashUniversityID)(uid));
        const moduleID = (yield ModuleRepo.addModule("Test Module")).id;
        yield EquipmentRepo.addModulesToEquipment(equipmentID, [moduleID]);
        yield SubmissionRepo.addSubmission(userID, moduleID, true);
        expect(yield EquipmentRepo.hasAccess(uid, equipmentID)).toBe(true);
    }));
    test("hasAcccess with hold", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com",
        })).id;
        const uid = "000000000";
        const user = yield UserRepo.updateStudentProfile({
            userID: userID,
            pronouns: "he/him",
            college: "Test College",
            expectedGraduation: "2050",
            universityID: uid
        });
        expect(user.universityID).toBe((0, UserRepository_1.hashUniversityID)(uid));
        yield Holdsrepo.createHold(userID, userID, "Test Hold");
        expect(yield EquipmentRepo.hasAccess(uid, equipmentID)).toBe(false);
    }));
    test("hasAcccess with insufficient training", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = (yield RoomRepo.addRoom({
            id: 0,
            name: "Test Room"
        })).id;
        const equipmentID = (yield EquipmentRepo.addEquipment({
            name: "Test Equipment",
            roomID: roomID,
            moduleIDs: []
        })).id;
        expect(yield EquipmentRepo.getEquipmentByID(equipmentID)).toBeDefined();
        const userID = (yield UserRepo.createUser({
            firstName: "John",
            lastName: "Doe",
            ritUsername: "jd0000",
            email: "jd0000@example.com",
        })).id;
        const uid = "000000000";
        const user = yield UserRepo.updateStudentProfile({
            userID: userID,
            pronouns: "he/him",
            college: "Test College",
            expectedGraduation: "2050",
            universityID: uid
        });
        expect(user.universityID).toBe((0, UserRepository_1.hashUniversityID)(uid));
        const moduleID = (yield ModuleRepo.addModule("Test Module")).id;
        yield EquipmentRepo.addModulesToEquipment(equipmentID, [moduleID]);
        expect(yield EquipmentRepo.hasAccess(uid, equipmentID)).toBe(false);
    }));
});
//# sourceMappingURL=equipmentRepo.test.js.map