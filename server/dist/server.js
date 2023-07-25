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
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const server_plugin_landing_page_graphql_playground_1 = require("@apollo/server-plugin-landing-page-graphql-playground");
const http_1 = require("http");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const auth_1 = require("./auth");
const context_1 = __importDefault(require("./context"));
const body_parser_1 = require("body-parser");
const path_1 = __importDefault(require("path"));
var morgan = require("morgan");
const CORS_CONFIG = {
    origin: process.env.REACT_APP_ORIGIN,
    credentials: true,
};
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        require("dotenv").config({ path: __dirname + "/./../.env" });
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)(CORS_CONFIG));
        app.use((0, compression_1.default)());
        app.use(morgan("combined"));
        (0, auth_1.setupSessions)(app);
        if (process.env.NODE_ENV === "development") {
            app.set('views', path_1.default.join(__dirname, 'views'));
            app.set('view engine', 'ejs');
            (0, auth_1.setupDevAuth)(app);
        }
        else if (process.env.NODE_ENV === "staging") {
            (0, auth_1.setupStagingAuth)(app);
        }
        else if (process.env.NODE_ENV === "production") {
            app.set("trust proxy", 1);
            (0, auth_1.setupAuth)(app);
        }
        else {
            process.exit(-1);
        }
        app.use("/app", express_1.default.static(path_1.default.join(__dirname, "../../client/npx browserslist@latest --update-db\n")));
        app.all("/app/*", (req, res, next) => {
            if (req.user) {
                return next();
            }
            res.redirect("/login");
        });
        +app.get("/", function (req, res) {
            res.redirect("/app");
        });
        app.get("/app/*", function (req, res) {
            res.sendFile(path_1.default.join(__dirname, "../../client/build", "index.html"));
        });
        const server = new server_1.ApolloServer({
            schema: schema_1.schema,
            plugins: [(0, server_plugin_landing_page_graphql_playground_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        });
        yield server.start();
        app.use("/graphql", (0, cors_1.default)(CORS_CONFIG), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, { context: context_1.default }));
        const httpServer = (0, http_1.createServer)(app);
        const PORT = process.env.PORT || 3000;
        httpServer.listen({ port: PORT }, () => console.log(`🚀 GraphQL-Server is running on https://localhost:${PORT}/graphql`));
    });
}
startServer();
//# sourceMappingURL=server.js.map