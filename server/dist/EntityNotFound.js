"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEntityNotFoundError = exports.EntityNotFound = void 0;
const graphql_1 = require("graphql");
class EntityNotFound extends graphql_1.GraphQLError {
    constructor(message) {
        super(message, {
            extensions: { code: "ENTITY_NOT_FOUND" },
        });
    }
}
exports.EntityNotFound = EntityNotFound;
function buildEntityNotFoundError(message) {
    return new graphql_1.GraphQLError(message, {
        extensions: { code: "ENTITY_NOT_FOUND" },
    });
}
exports.buildEntityNotFoundError = buildEntityNotFoundError;
//# sourceMappingURL=EntityNotFound.js.map