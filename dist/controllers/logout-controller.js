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
exports.logoutHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const logoutHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log("cookies: ", cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return next(res.status(204).json({ message: "Nie jesteś zalogowany." })); //No content
    const refreshToken = cookies.jwt;
    /** is refresh token in DB */
    let foundUser;
    try {
        foundUser = yield User_1.default.findOne({ refreshToken });
    }
    catch (err) {
        return next(new http_error_1.default("Coś poszło nie tak, spróbuj ponownie.", 500));
    }
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
        return next(res.status(204).json({ message: "Nie jesteś zalogowany." }));
    }
    /** delete refresh token in DB if needed */
    foundUser.refreshToken = "";
    let result;
    try {
        result = yield foundUser.save();
        console.log(result);
        /** final response */
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true, //TODO: turn on for Browsers / off for ThunderClient
        });
        res.status(204).json({ message: "Nie jesteś zalogowany." });
    }
    catch (err) {
        return next(new http_error_1.default("Coś poszło nie tak, spróbuj ponownie.", 500));
    }
});
exports.logoutHandler = logoutHandler;
