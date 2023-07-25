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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifAuthenticated = exports.ifAllowedOrSelf = exports.ifAllowed = void 0;
const GraphQLError_1 = require("graphql/error/GraphQLError");
const ifAllowed = (expressUser) => (allowedPrivileges, callback) => {
    if (!expressUser) {
        throw new GraphQLError_1.GraphQLError("Unauthenticated");
    }
    const user = expressUser;
    const sufficientPrivilege = allowedPrivileges.includes(user.privilege);
    if (!sufficientPrivilege) {
        throw new GraphQLError_1.GraphQLError("Insufficient privilege");
    }
    if (user.hasHolds) {
        throw new GraphQLError_1.GraphQLError("User has outstanding account holds");
    }
    return callback(user);
};
exports.ifAllowed = ifAllowed;
const ifAllowedOrSelf = (expressUser) => (targetedUserID, allowedPrivileges, callback) => {
    if (!expressUser) {
        throw new GraphQLError_1.GraphQLError("Unauthenticated - ifallowedorself");
    }
    const user = expressUser;
    if (user.id === targetedUserID) {
        return callback(user);
    }
    else {
        return (0, exports.ifAllowed)(expressUser)(allowedPrivileges, callback);
    }
};
exports.ifAllowedOrSelf = ifAllowedOrSelf;
const ifAuthenticated = (expressUser) => (callback) => {
    if (!expressUser) {
        throw new GraphQLError_1.GraphQLError("Unauthenticated");
    }
    const user = expressUser;
    return callback(user);
};
exports.ifAuthenticated = ifAuthenticated;
const context = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        user: req.user,
        logout: () => req.logout(),
        ifAllowed: (0, exports.ifAllowed)(req.user),
        ifAllowedOrSelf: (0, exports.ifAllowedOrSelf)(req.user),
        ifAuthenticated: (0, exports.ifAuthenticated)(req.user)
    });
});
exports.default = context;
//# sourceMappingURL=context.js.map