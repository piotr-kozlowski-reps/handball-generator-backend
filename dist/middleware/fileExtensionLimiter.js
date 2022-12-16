"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// const deleteFile = require("../utils/deleteFIle");
const http_error_1 = __importDefault(require("../utils/http-error"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
/** fileExtensionLimiter checks if all files from form have desired extensions |
 * example of allowedExtensionsArray: [".png", ".jpg", ".jpeg"]
 */
const fileExtensionLimiter = (allowedExtensionsArray) => {
    return (req, res, next) => {
        const file = req.file;
        const files = req.files;
        console.log({ file });
        console.log({ files });
        let isAllowed = true;
        if (file) {
            const fileExtension = path_1.default.extname(file.originalname);
            isAllowed = allowedExtensionsArray.includes(fileExtension);
        }
        if (files) {
            files.forEach((file) => {
                const fileExtension = path_1.default.extname(file.originalname);
                console.log({ fileExtension });
                isAllowed = isAllowed && allowedExtensionsArray.includes(fileExtension);
                console.log({ isAllowed });
            });
        }
        if (files.length < 1)
            isAllowed = false;
        if (!isAllowed) {
            ImageFilesUtils_1.default.deleteFiles(file ? [file] : files);
            return next(new http_error_1.default(`Obrazek musi być plikiem o rozszerzeniu: ${allowedExtensionsArray.toString()}`, 400));
        }
        next();
    };
};
exports.default = fileExtensionLimiter;
