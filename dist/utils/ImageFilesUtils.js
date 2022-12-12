"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const logEvents_1 = require("../middleware/logEvents");
const loggerFilesNames_1 = require("../config/loggerFilesNames");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
class ImageFilesUtils {
    //images utils
    static deleteFiles(items) {
        const result = [];
        if (items.length === 0)
            return result;
        if (items[0].path) {
            items.forEach((file) => {
                console.log(file);
                const fileProperlyTyped = file;
                const deleteResult = ImageFilesUtils.deleteFile(fileProperlyTyped.path);
                result.push(deleteResult);
            });
        }
        else {
            items.forEach((path) => {
                console.log(path);
                const deleteResult = this.deleteFile(path);
                result.push(deleteResult);
            });
        }
        return result;
    }
    static createThumbnails(imagesArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const processedImages = [];
            const unprocessedImages = [];
            try {
                for (let i = 0; i < imagesArray.length; i++) {
                    const imageFile = imagesArray[i];
                    const result = yield this.createThumbnail(imageFile);
                    if (!result)
                        unprocessedImages.push(imageFile);
                    else {
                        const imageWithThumbnail = Object.assign(imageFile, { thumbnailPath: result.thumbnailPath });
                        processedImages.push(imageWithThumbnail);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
            return { processedImages, unprocessedImages };
        });
    }
    //private
    static createThumbnail(imageFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = imageFile.path;
            const fileNameFull = path_1.default.basename(filePath);
            const directoriesPath = filePath.replace(fileNameFull, "");
            const extensionName = path_1.default.extname(fileNameFull);
            const fileNameWithoutExtension = fileNameFull
                .replace(extensionName, "")
                .toLowerCase();
            //thumbnail path and name
            const thumbnailPath = `${directoriesPath}${fileNameWithoutExtension}__thumbnail.jpg`;
            //create thumbnail
            let newThumbnail;
            try {
                newThumbnail = yield (0, sharp_1.default)(filePath)
                    .resize({
                    width: 200,
                    height: 200,
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0.5 },
                })
                    .toFormat("jpg", { quality: 30 })
                    .toFile(thumbnailPath);
            }
            catch (error) {
                console.error(error);
                return;
            }
            return { newThumbnail, thumbnailPath };
        });
    }
    static deleteFile(filePath) {
        console.log(`deleting file: ${filePath}`);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                return "FILE_DELETED";
            }
            catch (err) {
                const error = err;
                (0, logEvents_1.logEvents)(`${error.name}: ${error.message}`, loggerFilesNames_1.ERROR_LOGGER);
                return "FILE_UNDELETED";
            }
        }
        return " FILE_NOT_FOUND";
    }
}
exports.default = ImageFilesUtils;
