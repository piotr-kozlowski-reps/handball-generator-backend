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
exports.refreshTokenHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvironmentalVariablesUtil_1 = __importDefault(require("../utils/EnvironmentalVariablesUtil"));
const refreshTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        console.log("nie ma cookiesa ");
        return next(new http_error_1.default("Nie jesteś zalogowany.", 401));
    }
    const refreshToken = cookies.jwt;
    /** Find user in DB via refreshToken */
    let foundUser;
    try {
        foundUser = yield User_1.default.findOne({ refreshToken });
    }
    catch (err) {
        return next(new http_error_1.default("Nie masz autoryzacji, spróbuj ponownie.", 500));
    }
    if (!foundUser)
        return next(new http_error_1.default("Dostęp zabroniony.", 403)); //forbidden
    /** Evaluate jwt */
    jsonwebtoken_1.default.verify(refreshToken, EnvironmentalVariablesUtil_1.default.getRefreshTokenSecret(), (err, decoded) => {
        if (err || !foundUser || foundUser.userName !== decoded.userName)
            return next(new http_error_1.default("Dostęp zabroniony.", 403)); //forbidden
        const roles = Object.values(foundUser.roles).filter(Boolean);
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                userName: decoded.userName,
                roles,
            },
        }, EnvironmentalVariablesUtil_1.default.getAccessTokenSecret(), { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        //final response
        res.json({ roles, accessToken });
    });
});
exports.refreshTokenHandler = refreshTokenHandler;
