"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex = exports.newInstance = void 0;
const knex_1 = require("knex");
const connection = require("../db/knexFile")[process.env.NODE_ENV || "development"];
function newInstance() {
    return (0, knex_1.knex)(require("../db/knexFile")[process.env.NODE_ENV || "development"]);
}
exports.newInstance = newInstance;
const knexInstance = (0, knex_1.knex)(connection);
exports.knex = knexInstance;
//# sourceMappingURL=index.js.map