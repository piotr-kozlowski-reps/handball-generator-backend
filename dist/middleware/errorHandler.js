"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = require("./logEvents");
const loggerFilesNames_1 = require("../config/loggerFilesNames");
const errorHandler = (err, req, res, next) => {
    (0, logEvents_1.logEvents)(`${err.name}: ${err.message}`, loggerFilesNames_1.ERROR_LOGGER);
    console.error(err.stack);
    if (res.headersSent)
        return next(err);
    res.status(err.code || 500).send(err.message || "An unknown error occurred.");
};
exports.default = errorHandler;
