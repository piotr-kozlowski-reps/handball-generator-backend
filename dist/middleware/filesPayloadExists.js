"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = __importDefault(require("../utils/http-error"));
/** filesPayloadExists checks if there is file or files property in req */
const filesPayloadExists = (req, res, next) => {
    if (!req.file && !req.files) {
        return next(new http_error_1.default("Brak pliku/ów graficznych.", 400));
    }
    next();
};
exports.default = filesPayloadExists;
