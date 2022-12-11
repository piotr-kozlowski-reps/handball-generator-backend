"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const EnvironmentalVariablesUtils_1 = __importDefault(require("../utils/EnvironmentalVariablesUtils"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization ||
        req.headers.Authorization;
    console.log({ authHeader });
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
        return next(new http_error_1.default("Nie masz dostępu do tych zasobów.", 401));
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, EnvironmentalVariablesUtils_1.default.getAccessTokenSecret(), (err, decoded) => {
        if (err)
            return next(new http_error_1.default("Token jest niepoprawny", 403));
        req.user = decoded.UserInfo.userName;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};
exports.default = verifyJWT;
