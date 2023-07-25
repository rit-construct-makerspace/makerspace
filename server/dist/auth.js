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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuth = exports.setupStagingAuth = exports.setupDevAuth = exports.setupSessions = void 0;
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const passport_saml_1 = require("@node-saml/passport-saml");
const passport_local_1 = require("passport-local");
const express_session_1 = __importDefault(require("express-session"));
const uuid_1 = require("uuid");
const assert_1 = __importDefault(require("assert"));
const express_1 = __importDefault(require("express"));
const UserRepository_1 = require("./repositories/Users/UserRepository");
const HoldsRepository_1 = require("./repositories/Holds/HoldsRepository");
const AuditLogRepository_1 = require("./repositories/AuditLogs/AuditLogRepository");
const path_1 = __importDefault(require("path"));
function mapToDevUser(userID, password) {
    var obj = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "/data/devUsers.json"), 'utf8'));
    const devUser = obj[userID];
    if (devUser === undefined || devUser["password"] !== password) {
        return undefined;
    }
    else {
        return {
            firstName: devUser.firstName,
            lastName: devUser.lastName,
            email: devUser.email,
            ritUsername: devUser.ritUsername
        };
    }
}
function mapSamlTestToRit(testUser) {
    return {
        firstName: testUser["urn:oid:2.5.4.42"],
        lastName: testUser["urn:oid:2.5.4.4"],
        email: testUser.email,
        ritUsername: testUser.email.split("@")[0],
    };
}
function setupSessions(app) {
    const secret = process.env.SESSION_SECRET;
    (0, assert_1.default)(secret, "SESSION_SECRET env value is null");
    app.use((0, express_session_1.default)({
        genid: (req) => (0, uuid_1.v4)(),
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production" ? true : false,
            httpOnly: true,
            maxAge: 900000,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict"
        },
    }));
}
exports.setupSessions = setupSessions;
function setupDevAuth(app) {
    const reactAppUrl = process.env.REACT_APP_URL;
    (0, assert_1.default)(reactAppUrl, "REACT_APP_URL env value is null");
    const authStrategy = new passport_local_1.Strategy(function (username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devUser = mapToDevUser(username, password);
                if (devUser === undefined) {
                    console.log("failed");
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                else {
                    console.log("valid login");
                    return done(null, devUser);
                }
            }
            catch (err) {
                console.log(err);
                done(null, false, { message: 'some error' });
            }
        });
    });
    passport_1.default.serializeUser((user, done) => __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield (0, UserRepository_1.getUserByRitUsername)(user.ritUsername);
        if (!existingUser) {
            yield (0, UserRepository_1.createUser)(user);
        }
        done(null, user.ritUsername);
    }));
    passport_1.default.deserializeUser((username, done) => __awaiter(this, void 0, void 0, function* () {
        const user = (yield (0, UserRepository_1.getUserByRitUsername)(username));
        if (!user)
            throw new Error("Tried to deserialize user that doesn't exist");
        const holds = yield (0, HoldsRepository_1.getHoldsByUser)(user.id);
        user.hasHolds = holds.some((hold) => !hold.removeDate);
        done(null, user);
    }));
    passport_1.default.use(authStrategy);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    app.get('/login', function (req, res, next) {
        res.render('login');
    });
    app.post('/login/password', passport_1.default.authenticate('local', {
        successRedirect: reactAppUrl,
        failureRedirect: '/login'
    }));
    app.post("/logout", (req, res) => {
        passport_1.default.session().destroy;
        if (req.session) {
            req.session.destroy((err) => {
                var _a;
                if (err) {
                    res.status(400).send("Logout failed");
                }
                else {
                    res.redirect((_a = process.env.REACT_APP_LOGGED_OUT_URL) !== null && _a !== void 0 ? _a : "");
                }
            });
        }
        else {
            res.end();
        }
    });
}
exports.setupDevAuth = setupDevAuth;
function setupStagingAuth(app) {
    var _a, _b, _c;
    const issuer = process.env.ISSUER;
    const callbackUrl = process.env.CALLBACK_URL;
    const entryPoint = process.env.ENTRY_POINT;
    const reactAppUrl = process.env.REACT_APP_URL;
    (0, assert_1.default)(issuer, "ISSUER env value is null");
    (0, assert_1.default)(callbackUrl, "CALLBACK_URL env value is null");
    (0, assert_1.default)(entryPoint, "ENTRY_POINT env value is null");
    (0, assert_1.default)(reactAppUrl, "REACT_APP_URL env value is null");
    const samlConfig = {
        issuer: issuer,
        path: "/login/callback",
        callbackUrl: callbackUrl,
        entryPoint: entryPoint,
        identifierFormat: undefined,
        decryptionPvk: (_a = process.env.SSL_PVKEY) !== null && _a !== void 0 ? _a : "",
        privateCert: (_b = process.env.SSL_PVKEY) !== null && _b !== void 0 ? _b : "",
        cert: (_c = process.env.IDP_PUBKEY) !== null && _c !== void 0 ? _c : "",
        validateInResponseTo: passport_saml_1.ValidateInResponseTo.never,
        disableRequestedAuthnContext: true,
        acceptedClockSkewMs: 1000,
    };
    const authStrategy = new passport_saml_1.Strategy(samlConfig, (profile, done) => {
        return done(null, profile);
    }, (profile, done) => {
        return done(null, profile);
    });
    passport_1.default.serializeUser((user, done) => __awaiter(this, void 0, void 0, function* () {
        const ritUser = process.env.SAML_IDP === "TEST" ? mapSamlTestToRit(user) : user;
        const existingUser = yield (0, UserRepository_1.getUserByRitUsername)(ritUser.ritUsername);
        if (!existingUser) {
            yield (0, UserRepository_1.createUser)(ritUser);
        }
        done(null, ritUser.ritUsername);
    }));
    passport_1.default.deserializeUser((username, done) => __awaiter(this, void 0, void 0, function* () {
        const user = (yield (0, UserRepository_1.getUserByRitUsername)(username));
        if (!user)
            throw new Error("Tried to deserialize user that doesn't exist");
        const holds = yield (0, HoldsRepository_1.getHoldsByUser)(user.id);
        user.hasHolds = holds.some((hold) => !hold.removeDate);
        done(null, user);
    }));
    app.get("/Shibboleth.sso/Metadata", function (req, res) {
        var _a;
        res.type("application/xml");
        res
            .status(200)
            .send(authStrategy.generateServiceProviderMetadata((_a = process.env.SSL_PUBKEY) !== null && _a !== void 0 ? _a : ""));
    });
    passport_1.default.use(authStrategy);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    const authenticate = passport_1.default.authenticate("saml", {
        failureFlash: true,
        failureRedirect: "/login/fail",
        successRedirect: reactAppUrl,
    });
    app.get("/login", authenticate);
    app.post("/login/callback", authenticate, (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log("Logged in");
        if (req.user && 'id' in req.user && 'firstName' in req.user && 'lastName' in req.user) {
            yield (0, AuditLogRepository_1.createLog)(`{user} logged in.`, { id: req.user.id, label: `${req.user.firstName} ${req.user.lastName}` });
        }
    }));
    app.get("/login/fail", function (req, res) {
        res.status(401).send("Login failed");
    });
    app.post("/logout", (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                var _a;
                if (err) {
                    res.status(400).send("Logout failed");
                }
                else {
                    res.redirect((_a = process.env.REACT_APP_LOGGED_OUT_URL) !== null && _a !== void 0 ? _a : "");
                }
            });
        }
        else {
            res.end();
        }
    });
}
exports.setupStagingAuth = setupStagingAuth;
function setupAuth(app) {
}
exports.setupAuth = setupAuth;
//# sourceMappingURL=auth.js.map