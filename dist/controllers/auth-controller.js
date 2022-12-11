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
exports.authHandler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvironmentalVariablesUtils_1 = __importDefault(require("../utils/EnvironmentalVariablesUtils"));
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // /** Encrypted password generator for temporary password*/
    // //start
    //userName: obslugameczu
    //password : obslugameczuhaslo1
    // const desiredPassword = "obslugameczuhaslo1";
    // let hashedPassword;
    // try {
    //   hashedPassword = await bcrypt.hash(desiredPassword, 12);
    //   console.log(hashedPassword);
    // } catch (error) {
    //   console.error(error);
    // }
    // //end
    const { userName, password } = req.body;
    if (!userName || !password)
        return res.status(400).json({ message: "Użytkownik i hasło są wymagane." });
    let foundUser;
    try {
        foundUser = yield User_1.default.findOne({ userName: userName });
    }
    catch (err) {
        return next(new http_error_1.default("Nie udało się zalogować, spróbuj ponownie.", 500));
    }
    if (!foundUser) {
        return next(new http_error_1.default("Niepoprawne dane, spróbuj raz jeszcze.", 401)); //unauthorized
    }
    //password check
    let isValidPassword;
    try {
        isValidPassword = yield bcryptjs_1.default.compare(password, foundUser.password);
    }
    catch (err) {
        return next(new http_error_1.default("Nieoczekiwany błąd. Sprawdź swoje dane logowania i spróbuj ponownie.", 500));
    }
    if (!isValidPassword) {
        return next(new http_error_1.default("Niepoprawne dane, spróbuj raz jeszcze.", 403));
    }
    ////final response
    const roles = Object.values(foundUser.roles).filter(Boolean);
    //create JWTs
    let accessToken;
    let refreshToken;
    try {
        accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                userName,
                roles,
            },
        }, EnvironmentalVariablesUtils_1.default.getAccessTokenSecret(), { expiresIn: EnvironmentalVariablesUtils_1.default.getAccessTokenExpiration() });
        refreshToken = jsonwebtoken_1.default.sign({ userName: foundUser.userName }, EnvironmentalVariablesUtils_1.default.getRefreshTokenSecret(), {
            expiresIn: EnvironmentalVariablesUtils_1.default.getRefreshTokenExpiration(),
        });
    }
    catch (err) {
        return next(new http_error_1.default("Nieoczekiwany błąd. Sprawdź swoje dane logowania i spróbuj ponownie.", 500));
    }
    //update user in DB with refreshToken
    foundUser.refreshToken = refreshToken;
    const result = yield foundUser.save();
    // console.log(result);
    //secure cookie set
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    //final response
    res.json({ roles, accessToken });
});
exports.authHandler = authHandler;
