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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const UserRepo = __importStar(require("../../repositories/Users/UserRepository"));
const ModuleRepo = __importStar(require("../../repositories/Training/ModuleRepository"));
const SubmissionRepo = __importStar(require("../../repositories/Training/SubmissionRepository"));
const usersSchema_1 = require("../../schemas/usersSchema");
const context_1 = require("../../context");
const server_1 = require("@apollo/server");
const schema_1 = require("../../schema");
const assert_1 = __importDefault(require("assert"));
const url = (_a = process.env.GRAPHQL_ENDPOINT) !== null && _a !== void 0 ? _a : "https://localhost:3000";
const tables = ["ModuleSubmissions", "TrainingModule", "Users", "AuditLogs"];
let userZero;
let userZeroContext;
const GET_USERS = `
    query GetUsers {
        users {
            id
            firstName
            lastName
            privilege
            pronouns
            college
            expectedGraduation
            universityID
        }
    }
`;
const GET_USER_BY_ID = `
    query GetUserByID($userID: ID!) {
        user(id: $userID) {
            id
            firstName
            lastName
            privilege
            pronouns
            college
            expectedGraduation
            universityID
        }
    }
`;
const CREATE_USER = `
    mutation CreateUser($firstName: String, $lastName: String, $ritUsername: String, $email: String) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            ritUsername: $ritUsername
            email: $email
          ) {
            id
            firstName
            lastName
            privilege
        }
    }
`;
const UPDATE_STUDENT_PROFILE = `
  mutation UpdateStudentProfile(
    $userID: ID!
    $pronouns: String
    $college: String
    $expectedGraduation: String
    $universityID: String
  ) {
    updateStudentProfile(
      userID: $userID
      pronouns: $pronouns
      college: $college
      expectedGraduation: $expectedGraduation
      universityID: $universityID
    ) {
      id
    }
  }
`;
const CREATE_HOLD = `
  mutation CreateHold($userID: ID!, $description: String!) {
    createHold(userID: $userID, description: $description) {
      id
    }
  }
`;
const ARCHIVE_USER = `
  mutation ArchiveUser($userID: ID!) {
    archiveUser(userID: $userID) {
      id
    }
  }
`;
const SET_PRIVILEGE = `
  mutation SetPrivilege($userID: ID!, $privilege: Privilege) {
    setPrivilege(userID: $userID, privilege: $privilege)
  }
`;
const GET_PASSED_MODULES = `
  query GetPassedModules($userID: ID!) {
    user(id: $userID) {
        passedModules {
          moduleName
        }
    }
  }
`;
describe("User tests", () => {
    beforeAll(() => {
        return db_1.knex.migrate.latest();
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const t of tables) {
                yield (0, db_1.knex)(t).del();
            }
            const userID = (yield UserRepo.createUser({
                firstName: "John",
                lastName: "Doe",
                ritUsername: "jd0000",
                email: "jd0000@example.com"
            })).id;
            userZero = yield UserRepo.getUserByID(userID);
            expect(userZero).toBeDefined();
            userZero = yield UserRepo.setPrivilege(userZero.id, usersSchema_1.Privilege.STAFF);
            expect(userZero.privilege).toBe(usersSchema_1.Privilege.STAFF);
            userZeroContext = {
                user: Object.assign(Object.assign({}, userZero), { hasHolds: false }),
                logout: () => { },
                ifAllowed: (0, context_1.ifAllowed)(userZero),
                ifAllowedOrSelf: (0, context_1.ifAllowedOrSelf)(userZero),
                ifAuthenticated: (0, context_1.ifAuthenticated)(userZero)
            };
        }
        catch (error) {
            console.error("Failed setup: " + error);
            fail();
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
    test("STAFF getUsers", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const res = (yield server.executeOperation({
            query: GET_USERS
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(res.body.kind === 'single');
        expect(res.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(res.body.singleResult.data);
        (0, assert_1.default)(Array.isArray(res.body.singleResult.data.users));
        expect(res.body.singleResult.data.users.length).toBe(1);
    }));
    test("STAFF addUser", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        let userRequestData = {
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        };
        let createRes = (yield server.executeOperation({
            query: CREATE_USER,
            variables: {
                firstName: userRequestData.firstName,
                lastName: userRequestData.lastName,
                ritUsername: userRequestData.ritUsername,
                email: userRequestData.email
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(createRes.body.kind === 'single');
        expect(createRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(createRes.body.singleResult.data);
        let userResponseData = createRes.body.singleResult.data.createUser;
        expect(userResponseData.firstName).toBe(userRequestData.firstName);
        expect(userResponseData.lastName).toBe(userRequestData.lastName);
        const users = yield UserRepo.getUsers();
        expect(users.length).toBe(2);
    }));
    test("STAFF getUserByID", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        const getUserRes = (yield server.executeOperation({
            query: GET_USER_BY_ID,
            variables: {
                userID: userID
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(getUserRes.body.kind === 'single');
        expect(getUserRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(getUserRes.body.singleResult.data);
        (0, assert_1.default)(getUserRes.body.singleResult.data.user);
        expect(Number(getUserRes.body.singleResult.data.user.id)).toBe(userID);
    }));
    test("MAKER update self", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        let user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        const newUserContext = {
            user: Object.assign(Object.assign({}, user), { hasHolds: false }),
            logout: () => { },
            ifAllowed: (0, context_1.ifAllowed)(user),
            ifAllowedOrSelf: (0, context_1.ifAllowedOrSelf)(user),
            ifAuthenticated: (0, context_1.ifAuthenticated)(user)
        };
        const updateRes = (yield server.executeOperation({
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        }, {
            contextValue: newUserContext
        }));
        (0, assert_1.default)(updateRes.body.kind === 'single');
        expect(updateRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(updateRes.body.singleResult.data);
        let updatedUser = yield UserRepo.getUserByID(userID);
        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.pronouns).toBe("she/her");
        expect(updatedUser.college).toBe("CAD");
        expect(updatedUser.expectedGraduation).toBe("2027");
        expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
    }));
    test("MAKER cannot update others", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        let user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        const newUserContext = {
            user: Object.assign(Object.assign({}, user), { hasHolds: false }),
            logout: () => { },
            ifAllowed: (0, context_1.ifAllowed)(user),
            ifAllowedOrSelf: (0, context_1.ifAllowedOrSelf)(user),
            ifAuthenticated: (0, context_1.ifAuthenticated)(user)
        };
        const updateRes = (yield server.executeOperation({
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userZero.id,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "222222222"
            }
        }, {
            contextValue: newUserContext
        }));
        (0, assert_1.default)(updateRes.body.kind === 'single');
        expect(updateRes.body.singleResult.errors).toBeDefined();
        const errors = updateRes.body.singleResult.errors;
        (0, assert_1.default)(Array.isArray(errors));
        expect(errors[0].message).toBe('Insufficient privilege');
        const updatedUser = yield UserRepo.getUserByID(userID);
        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.pronouns).toBe(userZero.pronouns);
        expect(updatedUser.college).toBe(userZero.college);
        expect(updatedUser.expectedGraduation).toBe(userZero.expectedGraduation);
    }));
    test("MENTOR update user", () => __awaiter(void 0, void 0, void 0, function* () {
        userZero = yield UserRepo.setPrivilege(userZero.id, usersSchema_1.Privilege.MENTOR);
        expect(userZero.privilege).toBe(usersSchema_1.Privilege.MENTOR);
        userZeroContext = {
            user: Object.assign(Object.assign({}, userZero), { hasHolds: false }),
            logout: () => { },
            ifAllowed: (0, context_1.ifAllowed)(userZero),
            ifAllowedOrSelf: (0, context_1.ifAllowedOrSelf)(userZero),
            ifAuthenticated: (0, context_1.ifAuthenticated)(userZero)
        };
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        const user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        const updateRes = (yield server.executeOperation({
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(updateRes.body.kind === 'single');
        expect(updateRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(updateRes.body.singleResult.data);
        const updatedUser = yield UserRepo.getUserByID(userID);
        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.pronouns).toBe("she/her");
        expect(updatedUser.college).toBe("CAD");
        expect(updatedUser.expectedGraduation).toBe("2027");
        expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
    }));
    test("STAFF update user", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        let user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        const updateRes = (yield server.executeOperation({
            query: UPDATE_STUDENT_PROFILE,
            variables: {
                userID: userID,
                pronouns: "she/her",
                college: "CAD",
                expectedGraduation: "2027",
                universityID: "000000000"
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(updateRes.body.kind === 'single');
        expect(updateRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(updateRes.body.singleResult.data);
        let updatedUser = yield UserRepo.getUserByID(userID);
        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.pronouns).toBe("she/her");
        expect(updatedUser.college).toBe("CAD");
        expect(updatedUser.expectedGraduation).toBe("2027");
        expect(updatedUser.universityID).toBe(UserRepo.hashUniversityID("000000000"));
    }));
    test("STAFF archive user", () => __awaiter(void 0, void 0, void 0, function* () {
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        const userID = (yield UserRepo.createUser({
            firstName: "Jane",
            lastName: "Doe",
            ritUsername: "jd1111",
            email: "jd1111@example.com"
        })).id;
        let user = yield UserRepo.getUserByID(userID);
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        const archiveRes = (yield server.executeOperation({
            query: ARCHIVE_USER,
            variables: {
                userID: userID
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(archiveRes.body.kind === 'single');
        expect(archiveRes.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(archiveRes.body.singleResult.data);
        let updatedUser = yield UserRepo.getUserByID(userID);
        expect(updatedUser).toBeDefined();
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.id).toBe(userID);
    }));
    test("MAKER get own passed modules", () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserRepo.setPrivilege(userZero.id, usersSchema_1.Privilege.MAKER);
        userZeroContext = {
            user: Object.assign(Object.assign({}, userZero), { hasHolds: false }),
            logout: () => { },
            ifAllowed: (0, context_1.ifAllowed)(userZero),
            ifAllowedOrSelf: (0, context_1.ifAllowedOrSelf)(userZero),
            ifAuthenticated: (0, context_1.ifAuthenticated)(userZero)
        };
        const moduleID = (yield ModuleRepo.addModule('Test Module')).id;
        const submissionID = (yield SubmissionRepo.addSubmission(userZero.id, moduleID, true))[0];
        let server = new server_1.ApolloServer({
            schema: schema_1.schema
        });
        let res = (yield server.executeOperation({
            query: GET_PASSED_MODULES,
            variables: {
                userID: userZero.id
            }
        }, {
            contextValue: userZeroContext
        }));
        (0, assert_1.default)(res.body.kind === 'single');
        expect(res.body.singleResult.errors).toBeUndefined();
        (0, assert_1.default)(res.body.singleResult.data);
        const passedModules = res.body.singleResult.data.user.passedModules;
        (0, assert_1.default)(Array.isArray(passedModules));
        expect(passedModules.length).toBe(1);
        expect(passedModules[0].moduleName).toBe('Test Module');
    }));
});
//# sourceMappingURL=user.test.js.map