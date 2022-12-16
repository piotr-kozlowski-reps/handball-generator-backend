"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = __importDefault(require("../utils/http-error"));
/** filesPayloadExists checks if there is file or files property in req */
const filesPayloadExists = (req, res, next) => {
    // console.log({ req });
    var _a;
    console.log("req.file: ", req.file);
    console.log("req.files: ", req.files);
    if (!req.file && !req.files) {
        return next(new http_error_1.default("Brak pliku/ów graficznych.", 400));
    }
    if (!req.file && ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        return next(new http_error_1.default("Brak pliku/ów graficznych.", 400));
    }
    next();
};
exports.default = filesPayloadExists;
