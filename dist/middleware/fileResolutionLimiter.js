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
const sharp_1 = __importDefault(require("sharp"));
// const deleteFile = require("../utils/deleteFIle");
const http_error_1 = __importDefault(require("../utils/http-error"));
const ImageFilesUtils_1 = __importDefault(require("../utils/ImageFilesUtils"));
const EnvironmentalVariablesUtils_1 = __importDefault(require("../utils/EnvironmentalVariablesUtils"));
const fileResolutionLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const files = req.files;
    let isAllowed = true;
    const filesArrayToBePossiblyDeleted = [];
    if (file) {
        filesArrayToBePossiblyDeleted.push(file);
        (yield checkIfFileSuitsSizeLimits(file))
            ? (isAllowed = isAllowed)
            : (isAllowed = false);
    }
    if (files) {
        filesArrayToBePossiblyDeleted.push(...files);
        for (let i = 0; i < files.length; i++) {
            const isFileInTheLimits = yield checkIfFileSuitsSizeLimits(files[i]);
            isAllowed = isAllowed && isFileInTheLimits;
        }
    }
    if (!isAllowed) {
        ImageFilesUtils_1.default.deleteFilesWithFilesArrayArgument(filesArrayToBePossiblyDeleted);
        return next(new http_error_1.default(`Któryś z plików ma zbyt duże wymiary.\nDopuszczalna szerokość pliku to: ${EnvironmentalVariablesUtils_1.default.getImageWidthLimiter()} px.\nDopuszczalna wysokość pliku to: ${EnvironmentalVariablesUtils_1.default.getImageHeightLimiter()} px.`, 400));
    }
    function checkIfFileSuitsSizeLimits(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const widthLimit = EnvironmentalVariablesUtils_1.default.getImageWidthLimiter();
            const heightLimit = EnvironmentalVariablesUtils_1.default.getImageHeightLimiter();
            let image;
            let metadata;
            try {
                image = yield (0, sharp_1.default)(file.path);
                metadata = yield image.metadata();
                if (!metadata)
                    return false;
                if (!metadata.width ||
                    metadata.width > widthLimit ||
                    !metadata.height ||
                    metadata.height > heightLimit)
                    return false;
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    function deleteFilesAndReturnError(filesPathsArray) {
        ImageFilesUtils_1.default.deleteFilesWithFilesArrayArgument(filesPathsArray);
        return next(new http_error_1.default(`Herb ma zbyt duże wymiary.\nDopuszczalna szerokość pliku to: ${EnvironmentalVariablesUtils_1.default.getImageWidthLimiter()} px.\nDopuszczalna wysokość pliku to: ${EnvironmentalVariablesUtils_1.default.getImageHeightLimiter()} px.`, 400));
    }
    next();
});
exports.default = fileResolutionLimiter;
